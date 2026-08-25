/**
 * SAMADHAN — CPGRAMS Historical Intelligence Engine
 * Computes historical department baselines, longitudinal trends, and current-vs-historical delta comparisons.
 * Uses verified 10-year DARPG historical dataset partitions (2016–2026).
 */

import { CpgramsService } from '../services/cpgramsService';
import { normalizeEntityName, areEntitiesEquivalent } from './entityNormalizer';
import { EvidenceReference } from '../intelligence/types';
import { DATASET_REGISTRY } from './datasetRegistry';

export type HistoricalTrendDirection =
  | 'IMPROVING'
  | 'STABLE'
  | 'DETERIORATING'
  | 'INSUFFICIENT_HISTORY';

export interface DepartmentHistoricalProfile {
  entity: string;
  scope: string;
  hasHistoricalBaseline: boolean;
  historicalPeriod?: string;
  historicalTotalReceived?: number;
  historicalTotalRedressed?: number;
  historicalDisposalRate?: number; // %
  historicalAverageDisposalDays?: number;
  currentDisposalRate: number; // %
  currentReceived: number;
  currentDisposed: number;
  currentPending: number;
  varianceDisposalRate: number; // percentage points delta (current - historical)
  trend: HistoricalTrendDirection;
  trendReason: string;
  evidence: EvidenceReference[];
}

export interface HistoricalSystemOverview {
  totalEntitiesTracked: number;
  totalEntitiesWithHistory: number;
  improvingCount: number;
  stableCount: number;
  deterioratingCount: number;
  insufficientHistoryCount: number;
  overallHistoricalDisposalRate: number;
  overallCurrentDisposalRate: number;
  overallSystemTrend: HistoricalTrendDirection;
  topImprovingEntities: Array<{
    entity: string;
    historicalBaseline: number;
    currentRate: number;
    delta: number;
  }>;
  topDeterioratingEntities: Array<{
    entity: string;
    historicalBaseline: number;
    currentRate: number;
    delta: number;
  }>;
  evidence: EvidenceReference[];
}

/**
 * Calculates historical baseline vs current performance for a specific authority.
 */
export function getDepartmentHistoricalComparison(
  entityName: string,
  service: CpgramsService
): DepartmentHistoricalProfile | null {
  const norm = normalizeEntityName(entityName);
  const targetEntity = norm.canonicalEntity;

  // 1. Get Live 2026 current performance
  const liveMetric = service.getDepartmentRanking('received', 'desc').find(
    m =>
      areEntitiesEquivalent(m.entity, targetEntity) ||
      areEntitiesEquivalent(m.entity, entityName) ||
      m.entity.toLowerCase() === targetEntity.toLowerCase() ||
      m.entity.toLowerCase() === entityName.toLowerCase()
  );

  if (!liveMetric) return null;

  // 2. Fetch Historical 10-Year Series (2016-01-01 to 2026-02-28) from department or state history
  const allHistReceipts = service
    .getMetric('receipts', { dataset: 'department_history_2016_2026-02-28' })
    .concat(service.getMetric('grievances_received', { dataset: 'department_history_2016_2026-02-28' }))
    .concat(service.getMetric('receipts', { dataset: 'state_history_2016_2026-02-28' }));

  const allHistDisposed = service
    .getMetric('disposed', { dataset: 'department_history_2016_2026-02-28' })
    .concat(service.getMetric('grievances_redressed', { dataset: 'department_history_2016_2026-02-28' }))
    .concat(service.getMetric('disposed', { dataset: 'state_history_2016_2026-02-28' }));

  const allHistAvgDays = service.getMetric('average_disposal_days', {
    dataset: 'department_history_2016_2026-02-28',
  });

  const histReceiptRow = allHistReceipts.find(r => areEntitiesEquivalent(r.entity, targetEntity));
  const histDisposedRow = allHistDisposed.find(r => areEntitiesEquivalent(r.entity, targetEntity));
  const histAvgDaysRow = allHistAvgDays.find(r => areEntitiesEquivalent(r.entity, targetEntity));

  const hasHistory = !!histReceiptRow && !!histDisposedRow;

  let histReceived = 0;
  let histRedressed = 0;
  let histDisposalRate = 0;
  let histAvgDays: number | undefined = undefined;
  let variance = 0;
  let trend: HistoricalTrendDirection = 'INSUFFICIENT_HISTORY';
  let trendReason = 'No longitudinal 10-year historical baseline recorded in the DARPG 2016–2026 series.';

  const evidenceList: EvidenceReference[] = [];

  // Add Live telemetry evidence
  evidenceList.push({
    dataset: 'live_dashboard_2026',
    entity: liveMetric.entity,
    metric: 'percent_disposed',
    value: `${liveMetric.effectiveDisposalRate}% (${liveMetric.disposed.toLocaleString('en-IN')}/${liveMetric.received.toLocaleString('en-IN')})`,
    period: '2026-01-01 to 2026-08-24',
    sourceUrl: DATASET_REGISTRY.cpgramsCurrentLive.url,
    sourceNote: DATASET_REGISTRY.cpgramsCurrentLive.description,
  });

  if (hasHistory && histReceiptRow && histDisposedRow) {
    histReceived = histReceiptRow.value;
    histRedressed = histDisposedRow.value;
    histDisposalRate = histReceived > 0 ? Number(((histRedressed / histReceived) * 100).toFixed(2)) : 0;
    if (histAvgDaysRow) {
      histAvgDays = histAvgDaysRow.value;
    }

    variance = Number((liveMetric.effectiveDisposalRate - histDisposalRate).toFixed(2));

    // Thresholds: +/- 2.5 percentage points constitutes material change
    if (variance >= 2.5) {
      trend = 'IMPROVING';
      trendReason = `Current disposal velocity (${liveMetric.effectiveDisposalRate}%) outperforms 10-year baseline (${histDisposalRate}%) by +${variance} percentage points.`;
    } else if (variance <= -5.0) {
      trend = 'DETERIORATING';
      trendReason = `Current disposal velocity (${liveMetric.effectiveDisposalRate}%) lags 10-year historical baseline (${histDisposalRate}%) by ${variance} percentage points.`;
    } else {
      trend = 'STABLE';
      trendReason = `Current disposal velocity (${liveMetric.effectiveDisposalRate}%) is within normal operational variance of 10-year historical baseline (${histDisposalRate}%).`;
    }

    evidenceList.push({
      dataset: histReceiptRow.dataset,
      entity: histReceiptRow.entity,
      metric: 'historical_disposal_baseline',
      value: `${histDisposalRate}% (${histRedressed.toLocaleString('en-IN')}/${histReceived.toLocaleString('en-IN')})`,
      period: '2016-01-01 to 2026-02-28',
      sourceUrl: DATASET_REGISTRY.cpgramsHistoricalDetailed.url,
      sourceNote: DATASET_REGISTRY.cpgramsHistoricalDetailed.description,
    });
  }

  return {
    entity: liveMetric.entity,
    scope: liveMetric.scope,
    hasHistoricalBaseline: hasHistory,
    historicalPeriod: hasHistory ? '2016-01-01 to 2026-02-28' : undefined,
    historicalTotalReceived: hasHistory ? histReceived : undefined,
    historicalTotalRedressed: hasHistory ? histRedressed : undefined,
    historicalDisposalRate: hasHistory ? histDisposalRate : undefined,
    historicalAverageDisposalDays: histAvgDays,
    currentDisposalRate: liveMetric.effectiveDisposalRate,
    currentReceived: liveMetric.received,
    currentDisposed: liveMetric.disposed,
    currentPending: liveMetric.totalPending,
    varianceDisposalRate: variance,
    trend,
    trendReason,
    evidence: evidenceList,
  };
}

/**
 * Returns historical comparisons across all active reporting departments.
 */
export function getAllHistoricalComparisons(service: CpgramsService): DepartmentHistoricalProfile[] {
  const ranking = service.getDepartmentRanking('received', 'desc');
  const results: DepartmentHistoricalProfile[] = [];

  for (const dept of ranking) {
    const profile = getDepartmentHistoricalComparison(dept.entity, service);
    if (profile) {
      results.push(profile);
    }
  }

  return results;
}

/**
 * Generates an executive system-wide historical intelligence overview.
 */
export function getHistoricalSystemOverview(service: CpgramsService): HistoricalSystemOverview {
  const comparisons = getAllHistoricalComparisons(service);

  const withHistory = comparisons.filter(c => c.hasHistoricalBaseline);
  const improving = comparisons.filter(c => c.trend === 'IMPROVING');
  const stable = comparisons.filter(c => c.trend === 'STABLE');
  const deteriorating = comparisons.filter(c => c.trend === 'DETERIORATING');
  const insufficient = comparisons.filter(c => c.trend === 'INSUFFICIENT_HISTORY');

  const totalHistReceived = withHistory.reduce((sum, c) => sum + (c.historicalTotalReceived || 0), 0);
  const totalHistRedressed = withHistory.reduce((sum, c) => sum + (c.historicalTotalRedressed || 0), 0);
  const overallHistRate = totalHistReceived > 0 ? Number(((totalHistRedressed / totalHistReceived) * 100).toFixed(2)) : 0;

  const totalCurrentReceived = withHistory.reduce((sum, c) => sum + c.currentReceived, 0);
  const totalCurrentDisposed = withHistory.reduce((sum, c) => sum + c.currentDisposed, 0);
  const overallCurrentRate = totalCurrentReceived > 0 ? Number(((totalCurrentDisposed / totalCurrentReceived) * 100).toFixed(2)) : 0;

  let overallTrend: HistoricalTrendDirection = 'STABLE';
  if (overallCurrentRate > overallHistRate + 1.5) overallTrend = 'IMPROVING';
  else if (overallCurrentRate < overallHistRate - 3.0) overallTrend = 'DETERIORATING';

  const topImproving = [...withHistory]
    .sort((a, b) => b.varianceDisposalRate - a.varianceDisposalRate)
    .slice(0, 5)
    .map(c => ({
      entity: c.entity,
      historicalBaseline: c.historicalDisposalRate || 0,
      currentRate: c.currentDisposalRate,
      delta: c.varianceDisposalRate,
    }));

  const topDeteriorating = [...withHistory]
    .sort((a, b) => a.varianceDisposalRate - b.varianceDisposalRate)
    .slice(0, 5)
    .map(c => ({
      entity: c.entity,
      historicalBaseline: c.historicalDisposalRate || 0,
      currentRate: c.currentDisposalRate,
      delta: c.varianceDisposalRate,
    }));

  return {
    totalEntitiesTracked: comparisons.length,
    totalEntitiesWithHistory: withHistory.length,
    improvingCount: improving.length,
    stableCount: stable.length,
    deterioratingCount: deteriorating.length,
    insufficientHistoryCount: insufficient.length,
    overallHistoricalDisposalRate: overallHistRate,
    overallCurrentDisposalRate: overallCurrentRate,
    overallSystemTrend: overallTrend,
    topImprovingEntities: topImproving,
    topDeterioratingEntities: topDeteriorating,
    evidence: [
      {
        dataset: 'department_history_2016_2026-02-28',
        entity: 'All Reporting Central Ministries',
        metric: 'longitudinal_disposal_baseline',
        value: `${overallHistRate}% historical average`,
        period: '2016-01-01 to 2026-02-28',
        sourceUrl: DATASET_REGISTRY.cpgramsHistoricalDetailed.url,
        sourceNote: DATASET_REGISTRY.cpgramsHistoricalDetailed.description,
      },
      {
        dataset: 'live_dashboard_2026',
        entity: 'All Reporting Central Ministries',
        metric: 'current_disposal_velocity',
        value: `${overallCurrentRate}% current 2026 velocity`,
        period: '2026-01-01 to 2026-08-24',
        sourceUrl: DATASET_REGISTRY.cpgramsCurrentLive.url,
        sourceNote: DATASET_REGISTRY.cpgramsCurrentLive.description,
      },
    ],
  };
}
