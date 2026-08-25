/**
 * SAMADHAN — CPGRAMS Data Transformation & Pivot Engine
 * Converts normalized long-format rows into structured period-level metrics and department aggregates.
 */

import {
  NormalizedMetricRow,
  PeriodDepartmentMetrics,
  DepartmentSummary,
  SystemLevelTotals,
} from './types';

/**
 * Transforms normalized long rows into period-department records.
 */
export function pivotMetricsByEntityAndPeriod(
  rows: NormalizedMetricRow[]
): Map<string, PeriodDepartmentMetrics> {
  // Key: entity + ":::" + dataset + ":::" + periodKey
  const grouped = new Map<string, PeriodDepartmentMetrics>();

  for (const row of rows) {
    const compositeKey = `${row.entity}:::${row.dataset}:::${row.periodKey}`;

    if (!grouped.has(compositeKey)) {
      grouped.set(compositeKey, {
        entity: row.entity,
        scope: row.scope,
        dataset: row.dataset,
        periodStart: row.periodStart,
        periodEnd: row.periodEnd,
        periodKey: row.periodKey,
        received: 0,
        disposed: 0,
        sourcePercentDisposed: null,
        calculatedDisposalRate: null,
        effectiveDisposalRate: 0,
        pending_0_60_days: 0,
        pending_60_180_days: 0,
        pending_180_365_days: 0,
        pending_more_than_1_year: 0,
        totalPending: 0,
        rawMetrics: {},
      });
    }

    const target = grouped.get(compositeKey)!;
    target.rawMetrics[row.metric] = row.value;

    switch (row.metric) {
      case 'received':
      case 'receipts':
      case 'grievances_received':
      case 'appeals_received':
        target.received = row.value;
        break;
      case 'disposed':
      case 'grievances_redressed':
      case 'appeals_disposed':
        target.disposed = row.value;
        break;
      case 'percent_disposed':
      case 'appeals_percent_disposed':
        target.sourcePercentDisposed = row.value;
        break;
      case 'pending_0_60_days':
        target.pending_0_60_days = row.value;
        break;
      case 'pending_60_180_days':
        target.pending_60_180_days = row.value;
        break;
      case 'pending_180_365_days':
        target.pending_180_365_days = row.value;
        break;
      case 'pending_more_than_1_year':
        target.pending_more_than_1_year = row.value;
        break;
      case 'pending':
      case 'pendency':
      case 'appeals_pending':
        if (target.totalPending === 0) {
          target.totalPending = row.value;
        }
        break;
      default:
        break;
    }
  }

  // Calculate derived values for each period metric entry
  for (const metric of grouped.values()) {
    const bucketSum =
      metric.pending_0_60_days +
      metric.pending_60_180_days +
      metric.pending_180_365_days +
      metric.pending_more_than_1_year;

    if (bucketSum > 0 || (metric.pending_0_60_days !== 0 || metric.pending_60_180_days !== 0 || metric.pending_180_365_days !== 0 || metric.pending_more_than_1_year !== 0)) {
      metric.totalPending = bucketSum;
    } else if (metric.rawMetrics['pending'] !== undefined) {
      metric.totalPending = metric.rawMetrics['pending'];
    } else if (metric.rawMetrics['pendency'] !== undefined) {
      metric.totalPending = metric.rawMetrics['pendency'];
    } else if (metric.rawMetrics['appeals_pending'] !== undefined) {
      metric.totalPending = metric.rawMetrics['appeals_pending'];
    }

    // Calculated disposal rate only when received > 0
    if (metric.received > 0) {
      metric.calculatedDisposalRate = Number(((metric.disposed / metric.received) * 100).toFixed(2));
    } else {
      metric.calculatedDisposalRate = null;
    }

    // Effective disposal rate gives priority to verified source percent_disposed if available
    if (metric.sourcePercentDisposed !== null && !isNaN(metric.sourcePercentDisposed)) {
      metric.effectiveDisposalRate = metric.sourcePercentDisposed;
    } else if (metric.calculatedDisposalRate !== null) {
      metric.effectiveDisposalRate = metric.calculatedDisposalRate;
    } else {
      metric.effectiveDisposalRate = 0;
    }
  }

  return grouped;
}

/**
 * Builds Department Summaries grouping all historical periods for each department.
 */
export function buildDepartmentSummaries(
  periodMetricsMap: Map<string, PeriodDepartmentMetrics>
): DepartmentSummary[] {
  const entityMap = new Map<string, PeriodDepartmentMetrics[]>();

  for (const metric of periodMetricsMap.values()) {
    if (!entityMap.has(metric.entity)) {
      entityMap.set(metric.entity, []);
    }
    entityMap.get(metric.entity)!.push(metric);
  }

  const summaries: DepartmentSummary[] = [];

  for (const [entity, periods] of entityMap.entries()) {
    // Sort chronologically by periodEnd ascending
    periods.sort((a, b) => (a.periodEnd || '').localeCompare(b.periodEnd || ''));

    const latest = periods[periods.length - 1];
    const datasets = Array.from(new Set(periods.map(p => p.dataset)));

    let totalReceived = 0;
    let totalDisposed = 0;

    for (const p of periods) {
      totalReceived += p.received;
      totalDisposed += p.disposed;
    }

    summaries.push({
      entity,
      scope: latest.scope,
      datasets,
      latestPeriodKey: latest.periodKey,
      latestMetrics: latest,
      historicalPeriods: periods,
      totalReceived,
      totalDisposed,
      currentTotalPending: latest.totalPending,
      currentPendingMoreThan1Year: latest.pending_more_than_1_year,
      currentDisposalRate: latest.effectiveDisposalRate,
      isAttentionRequired: false,
      attentionReasons: [],
    });
  }

  return summaries;
}

/**
 * Computes system-wide totals across all departments for a given period and dataset.
 */
export function computeSystemTotals(
  periodMetrics: PeriodDepartmentMetrics[],
  periodKey?: string,
  dataset?: string
): SystemLevelTotals {
  let targetMetrics = periodMetrics;
  if (dataset) {
    targetMetrics = targetMetrics.filter(m => m.dataset === dataset);
  }
  if (periodKey) {
    targetMetrics = targetMetrics.filter(m => m.periodKey === periodKey);
  }

  if (targetMetrics.length === 0) {
    return {
      periodKey: periodKey || 'all',
      periodStart: '',
      periodEnd: '',
      dataset: dataset || 'all',
      departmentCount: 0,
      totalReceived: 0,
      totalDisposed: 0,
      overallDisposalRate: 0,
      averageDisposalRate: 0,
      totalPending_0_60: 0,
      totalPending_60_180: 0,
      totalPending_180_365: 0,
      totalPending_more_than_1_year: 0,
      totalPending: 0,
      criticalDepartmentsCount: 0,
      warningDepartmentsCount: 0,
    };
  }

  const sample = targetMetrics[0];
  let totalReceived = 0;
  let totalDisposed = 0;
  let sumDisposalRates = 0;
  let totalP0_60 = 0;
  let totalP60_180 = 0;
  let totalP180_365 = 0;
  let totalP1Year = 0;
  let totalPending = 0;

  for (const m of targetMetrics) {
    totalReceived += m.received;
    totalDisposed += m.disposed;
    sumDisposalRates += m.effectiveDisposalRate;
    totalP0_60 += m.pending_0_60_days;
    totalP60_180 += m.pending_60_180_days;
    totalP180_365 += m.pending_180_365_days;
    totalP1Year += m.pending_more_than_1_year;
    totalPending += m.totalPending;
  }

  const overallDisposalRate = totalReceived > 0
    ? Number(((totalDisposed / totalReceived) * 100).toFixed(2))
    : 0;

  const averageDisposalRate = targetMetrics.length > 0
    ? Number((sumDisposalRates / targetMetrics.length).toFixed(2))
    : 0;

  return {
    periodKey: sample.periodKey,
    periodStart: sample.periodStart,
    periodEnd: sample.periodEnd,
    dataset: sample.dataset,
    departmentCount: targetMetrics.length,
    totalReceived,
    totalDisposed,
    overallDisposalRate,
    averageDisposalRate,
    totalPending_0_60: totalP0_60,
    totalPending_60_180: totalP60_180,
    totalPending_180_365: totalP180_365,
    totalPending_more_than_1_year: totalP1Year,
    totalPending,
    criticalDepartmentsCount: 0,
    warningDepartmentsCount: 0,
  };
}
