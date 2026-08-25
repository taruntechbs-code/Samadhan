/**
 * SAMADHAN — CPGRAMS Analytics & Intelligence Layer
 * Real dataset queries, department rankings, attention triage, and historical trends.
 */

import {
  PeriodDepartmentMetrics,
  DepartmentSummary,
  SystemLevelTotals,
  AttentionRequiredItem,
  AttentionCriteriaConfig,
  DepartmentTrendPoint,
} from './types';
import {
  computeSystemTotals,
} from './transformer';

export const DEFAULT_ATTENTION_CONFIG: Required<AttentionCriteriaConfig> = {
  criticalPending1YearThreshold: 0,
  criticalDisposalRateThreshold: 80,
  warningDisposalRateThreshold: 90,
  warningPending180To365Threshold: 50,
};

function resolveAttentionConfig(config?: AttentionCriteriaConfig): Required<AttentionCriteriaConfig> {
  if (!config) return { ...DEFAULT_ATTENTION_CONFIG };
  return {
    criticalPending1YearThreshold:
      config.criticalPending1YearThreshold !== undefined
        ? config.criticalPending1YearThreshold
        : DEFAULT_ATTENTION_CONFIG.criticalPending1YearThreshold,
    criticalDisposalRateThreshold:
      config.criticalDisposalRateThreshold !== undefined
        ? config.criticalDisposalRateThreshold
        : DEFAULT_ATTENTION_CONFIG.criticalDisposalRateThreshold,
    warningDisposalRateThreshold:
      config.warningDisposalRateThreshold !== undefined
        ? config.warningDisposalRateThreshold
        : DEFAULT_ATTENTION_CONFIG.warningDisposalRateThreshold,
    warningPending180To365Threshold:
      config.warningPending180To365Threshold !== undefined
        ? config.warningPending180To365Threshold
        : DEFAULT_ATTENTION_CONFIG.warningPending180To365Threshold,
  };
}

/**
 * Evaluates attention status for a period-department metric record.
 */
export function evaluateAttentionStatus(
  metric: PeriodDepartmentMetrics,
  config?: AttentionCriteriaConfig
): { severity: 'CRITICAL' | 'WARNING' | 'NORMAL'; reasons: string[] } {
  const mergedConfig = resolveAttentionConfig(config);
  const reasons: string[] = [];

  let isCritical = false;
  let isWarning = false;

  // 1. Check Critical: Pending > 1 Year
  if (metric.pending_more_than_1_year > mergedConfig.criticalPending1YearThreshold) {
    isCritical = true;
    reasons.push(
      `${metric.pending_more_than_1_year} cases pending for >1 year (threshold: >${mergedConfig.criticalPending1YearThreshold})`
    );
  }

  // 2. Check Critical: Disposal Rate < 80%
  if (metric.effectiveDisposalRate < mergedConfig.criticalDisposalRateThreshold) {
    isCritical = true;
    reasons.push(
      `Disposal rate of ${metric.effectiveDisposalRate}% is below critical threshold of ${mergedConfig.criticalDisposalRateThreshold}%`
    );
  }

  if (isCritical) {
    return { severity: 'CRITICAL', reasons };
  }

  // 3. Check Warning: Disposal Rate < 90%
  if (metric.effectiveDisposalRate < mergedConfig.warningDisposalRateThreshold) {
    isWarning = true;
    reasons.push(
      `Disposal rate of ${metric.effectiveDisposalRate}% is below target threshold of ${mergedConfig.warningDisposalRateThreshold}%`
    );
  }

  // 4. Check Warning: Pending 180-365 days
  if (metric.pending_180_365_days > mergedConfig.warningPending180To365Threshold) {
    isWarning = true;
    reasons.push(
      `High volume pending 180-365 days (${metric.pending_180_365_days} cases > ${mergedConfig.warningPending180To365Threshold})`
    );
  }

  if (isWarning) {
    return { severity: 'WARNING', reasons };
  }

  return { severity: 'NORMAL', reasons: [] };
}

/**
 * Retrieves all departments requiring attention for a given period or list of period metrics.
 */
export function getAttentionRequiredDepartments(
  metrics: PeriodDepartmentMetrics[],
  config?: AttentionCriteriaConfig
): AttentionRequiredItem[] {
  const items: AttentionRequiredItem[] = [];

  for (const m of metrics) {
    const status = evaluateAttentionStatus(m, config);
    if (status.severity !== 'NORMAL') {
      items.push({
        entity: m.entity,
        scope: m.scope,
        dataset: m.dataset,
        periodKey: m.periodKey,
        severity: status.severity,
        reasons: status.reasons,
        pending_more_than_1_year: m.pending_more_than_1_year,
        effectiveDisposalRate: m.effectiveDisposalRate,
        totalPending: m.totalPending,
        received: m.received,
        disposed: m.disposed,
      });
    }
  }

  // Sort by severity (CRITICAL first), then by pending_more_than_1_year descending, then lowest disposal rate
  return items.sort((a, b) => {
    if (a.severity === 'CRITICAL' && b.severity !== 'CRITICAL') return -1;
    if (a.severity !== 'CRITICAL' && b.severity === 'CRITICAL') return 1;
    if (b.pending_more_than_1_year !== a.pending_more_than_1_year) {
      return b.pending_more_than_1_year - a.pending_more_than_1_year;
    }
    return a.effectiveDisposalRate - b.effectiveDisposalRate;
  });
}

/**
 * Annotates DepartmentSummary items with attention metadata
 */
export function annotateDepartmentSummariesWithAttention(
  summaries: DepartmentSummary[],
  config?: AttentionCriteriaConfig
): DepartmentSummary[] {
  return summaries.map(summary => {
    const status = evaluateAttentionStatus(summary.latestMetrics, config);
    return {
      ...summary,
      isAttentionRequired: status.severity !== 'NORMAL',
      attentionSeverity: status.severity,
      attentionReasons: status.reasons,
    };
  });
}

/**
 * Calculates system totals including critical and warning counts
 */
export function getEnhancedSystemTotals(
  periodMetrics: PeriodDepartmentMetrics[],
  periodKey?: string,
  dataset?: string,
  config?: AttentionCriteriaConfig
): SystemLevelTotals {
  const base = computeSystemTotals(periodMetrics, periodKey, dataset);
  let targetMetrics = periodMetrics;
  if (dataset) {
    targetMetrics = targetMetrics.filter(m => m.dataset === dataset);
  }
  if (periodKey) {
    targetMetrics = targetMetrics.filter(m => m.periodKey === periodKey);
  }

  let critical = 0;
  let warning = 0;

  for (const m of targetMetrics) {
    const status = evaluateAttentionStatus(m, config);
    if (status.severity === 'CRITICAL') critical++;
    else if (status.severity === 'WARNING') warning++;
  }

  return {
    ...base,
    criticalDepartmentsCount: critical,
    warningDepartmentsCount: warning,
  };
}

/**
 * Rank departments by disposal rate
 */
export function rankDepartmentsByDisposalRate(
  metrics: PeriodDepartmentMetrics[],
  order: 'asc' | 'desc' = 'desc'
): PeriodDepartmentMetrics[] {
  return [...metrics].sort((a, b) => {
    const diff = b.effectiveDisposalRate - a.effectiveDisposalRate;
    return order === 'desc' ? diff : -diff;
  });
}

/**
 * Rank departments by grievance volume (received, disposed, or total pending)
 */
export function rankDepartmentsByVolume(
  metrics: PeriodDepartmentMetrics[],
  metricKey: 'received' | 'disposed' | 'totalPending' = 'received',
  order: 'asc' | 'desc' = 'desc'
): PeriodDepartmentMetrics[] {
  return [...metrics].sort((a, b) => {
    const diff = (b[metricKey] as number) - (a[metricKey] as number);
    return order === 'desc' ? diff : -diff;
  });
}

/**
 * Get departments with the highest grievances pending for more than 1 year
 */
export function getTopDepartmentsPendingOverOneYear(
  metrics: PeriodDepartmentMetrics[],
  limit = 10
): PeriodDepartmentMetrics[] {
  return [...metrics]
    .filter(m => m.pending_more_than_1_year > 0)
    .sort((a, b) => b.pending_more_than_1_year - a.pending_more_than_1_year)
    .slice(0, limit);
}

/**
 * Returns historical trend for a single department across all periods
 */
export function getDepartmentTrend(
  departmentName: string,
  periodMetrics: PeriodDepartmentMetrics[]
): DepartmentTrendPoint[] {
  return periodMetrics
    .filter(m => m.entity.toLowerCase() === departmentName.toLowerCase())
    .sort((a, b) => (a.periodEnd || '').localeCompare(b.periodEnd || ''))
    .map(m => ({
      dataset: m.dataset,
      periodKey: m.periodKey,
      periodStart: m.periodStart,
      periodEnd: m.periodEnd,
      received: m.received,
      disposed: m.disposed,
      disposalRate: m.effectiveDisposalRate,
      totalPending: m.totalPending,
      pending_more_than_1_year: m.pending_more_than_1_year,
    }));
}
