/**
 * SAMADHAN — CPGRAMS Intelligence Service Layer
 * Reusable analytical engine with strict dataset separation, source traceability, and explainable attention logic.
 */

import {
  NormalizedMetricRow,
  PeriodDepartmentMetrics,
  DepartmentSummary,
  AttentionCriteriaConfig,
} from '../data/types';
import {
  pivotMetricsByEntityAndPeriod,
  buildDepartmentSummaries,
} from '../data/transformer';
import {
  evaluateAttentionStatus,
  DEFAULT_ATTENTION_CONFIG,
} from '../data/analytics';
import {
  QueryFilters,
  AgingAnalysis,
  SystemOverview,
  DepartmentDetail,
  AttentionDetail,
  AppealsOverview,
  HistoricalTrendSeries,
  SortableDepartmentMetric,
  SourceTraceability,
} from './types';

export class CpgramsService {
  private normalizedRows: NormalizedMetricRow[];
  private pivotedMetricsMap: Map<string, PeriodDepartmentMetrics>;
  private departmentSummaries: DepartmentSummary[];
  private rawRowsByEntity: Map<string, NormalizedMetricRow[]>;

  constructor(normalizedRows: NormalizedMetricRow[]) {
    this.normalizedRows = normalizedRows;
    this.pivotedMetricsMap = pivotMetricsByEntityAndPeriod(normalizedRows);
    this.departmentSummaries = buildDepartmentSummaries(this.pivotedMetricsMap);
    
    // Index raw rows by entity for fast lookup
    this.rawRowsByEntity = new Map();
    for (const row of normalizedRows) {
      const entityKey = row.entity.toLowerCase().trim();
      if (!this.rawRowsByEntity.has(entityKey)) {
        this.rawRowsByEntity.set(entityKey, []);
      }
      this.rawRowsByEntity.get(entityKey)!.push(row);
    }
  }

  /**
   * Helper to retrieve all pivoted period-metrics as an array.
   */
  private getAllPeriodMetrics(): PeriodDepartmentMetrics[] {
    return Array.from(this.pivotedMetricsMap.values());
  }

  /**
   * Applies common filtering across period metrics.
   */
  private filterPeriodMetrics(
    metrics: PeriodDepartmentMetrics[],
    filters?: QueryFilters
  ): PeriodDepartmentMetrics[] {
    if (!filters) return metrics;

    return metrics.filter(m => {
      if (filters.scope && m.scope.toLowerCase() !== filters.scope.toLowerCase()) {
        return false;
      }
      if (filters.entity && !m.entity.toLowerCase().includes(filters.entity.toLowerCase())) {
        return false;
      }
      if (filters.dataset && m.dataset !== filters.dataset) {
        return false;
      }
      if (filters.periodStart && m.periodStart !== filters.periodStart) {
        return false;
      }
      if (filters.periodEnd && m.periodEnd !== filters.periodEnd) {
        return false;
      }
      if (filters.minDisposalRate !== undefined && m.effectiveDisposalRate < filters.minDisposalRate) {
        return false;
      }
      if (filters.maxDisposalRate !== undefined && m.effectiveDisposalRate > filters.maxDisposalRate) {
        return false;
      }
      return true;
    });
  }

  /**
   * Helper to extract source traceability info for a dataset or row.
   */
  private getSourceInfo(dataset: string, entity?: string): SourceTraceability {
    const matchingRow = this.normalizedRows.find(
      r => r.dataset === dataset && (!entity || r.entity.toLowerCase() === entity.toLowerCase())
    );

    return {
      dataset,
      periodStart: matchingRow?.periodStart || '',
      periodEnd: matchingRow?.periodEnd || '',
      sourceUrl: matchingRow?.sourceUrl || 'https://pgportal.gov.in/darpgdashboard',
      sourceNote: matchingRow?.sourceNote || 'Official CPGRAMS verified metrics dataset.',
    };
  }

  /**
   * 1. SYSTEM OVERVIEW
   * Uses live/current official dataset by default to prevent double counting.
   */
  public getSystemOverview(
    datasetName: string = 'live_dashboard_2026',
    filters?: QueryFilters
  ): SystemOverview {
    const allMetrics = this.getAllPeriodMetrics().filter(m => m.dataset === datasetName);
    const targetMetrics = this.filterPeriodMetrics(allMetrics, filters);

    let totalReceived = 0;
    let totalDisposed = 0;
    let p0_60 = 0;
    let p60_180 = 0;
    let p180_365 = 0;
    let p1Year = 0;
    let totalPending = 0;
    let criticalCount = 0;
    let warningCount = 0;

    const scopesSet = new Set<string>();
    const periodsSet = new Set<string>();

    for (const m of targetMetrics) {
      totalReceived += m.received;
      totalDisposed += m.disposed;
      p0_60 += m.pending_0_60_days;
      p60_180 += m.pending_60_180_days;
      p180_365 += m.pending_180_365_days;
      p1Year += m.pending_more_than_1_year;
      totalPending += m.totalPending;

      scopesSet.add(m.scope);
      if (m.periodKey) periodsSet.add(m.periodKey);

      const status = evaluateAttentionStatus(m);
      if (status.severity === 'CRITICAL') criticalCount++;
      else if (status.severity === 'WARNING') warningCount++;
    }

    const disposalRate = totalReceived > 0
      ? Number(((totalDisposed / totalReceived) * 100).toFixed(2))
      : 0;

    const sample = targetMetrics[0];

    return {
      dataset: datasetName,
      periodStart: sample?.periodStart || '',
      periodEnd: sample?.periodEnd || '',
      periodKey: sample?.periodKey || datasetName,
      received: totalReceived,
      disposed: totalDisposed,
      disposalRate,
      pending: totalPending,
      agingBuckets: {
        '0_60_days': p0_60,
        '60_180_days': p60_180,
        '180_365_days': p180_365,
        'over_1_year': p1Year,
        total: totalPending,
      },
      entities: targetMetrics.length,
      scopes: Array.from(scopesSet),
      periods: Array.from(periodsSet),
      criticalEntitiesCount: criticalCount,
      warningEntitiesCount: warningCount,
      source: this.getSourceInfo(datasetName),
    };
  }

  /**
   * 2. DEPARTMENT SUMMARIES
   */
  public getDepartmentSummaries(filters?: QueryFilters): DepartmentSummary[] {
    let summaries = this.departmentSummaries;

    if (filters?.scope) {
      summaries = summaries.filter(s => s.scope.toLowerCase() === filters.scope!.toLowerCase());
    }
    if (filters?.entity) {
      summaries = summaries.filter(s => s.entity.toLowerCase().includes(filters.entity!.toLowerCase()));
    }
    if (filters?.minDisposalRate !== undefined) {
      summaries = summaries.filter(s => s.currentDisposalRate >= filters.minDisposalRate!);
    }
    if (filters?.maxDisposalRate !== undefined) {
      summaries = summaries.filter(s => s.currentDisposalRate <= filters.maxDisposalRate!);
    }

    return summaries;
  }

  /**
   * 3. DEPARTMENT BY NAME (Detailed View)
   */
  public getDepartmentByName(entityName: string): DepartmentDetail | null {
    if (!entityName || typeof entityName !== 'string') return null;
    const searchKey = entityName.toLowerCase().trim();

    const entityRows = this.rawRowsByEntity.get(searchKey);
    if (!entityRows || entityRows.length === 0) {
      // Try fuzzy search if exact match is not found
      const matchedKey = Array.from(this.rawRowsByEntity.keys()).find(k => k.includes(searchKey));
      if (!matchedKey) return null;
      return this.getDepartmentByName(matchedKey);
    }

    const canonicalEntity = entityRows[0].entity;
    const scope = entityRows[0].scope;

    // Retrieve all period-metrics for this entity
    const allMetrics = this.getAllPeriodMetrics().filter(
      m => m.entity.toLowerCase() === searchKey || m.entity.toLowerCase() === canonicalEntity.toLowerCase()
    );

    // Find latest live/current period metric (prefer live_dashboard_2026)
    const liveMetric = allMetrics.find(m => m.dataset === 'live_dashboard_2026') || allMetrics[0];

    // Find appeal metric if available
    const appealMetric = allMetrics.find(m => m.dataset === 'appeal_dashboard_2026-08-25');
    let appeals: DepartmentDetail['appeals'] = undefined;
    if (appealMetric) {
      appeals = {
        received: appealMetric.received,
        disposed: appealMetric.disposed,
        pending: appealMetric.totalPending,
        disposalRate: appealMetric.effectiveDisposalRate,
      };
    }

    // Historical records
    const historicalPerformance = allMetrics.map(m => ({
      dataset: m.dataset,
      periodStart: m.periodStart,
      periodEnd: m.periodEnd,
      periodKey: m.periodKey,
      received: m.received,
      disposed: m.disposed,
      disposalRate: m.effectiveDisposalRate,
      totalPending: m.totalPending,
      rawMetrics: m.rawMetrics,
    }));

    return {
      entity: canonicalEntity,
      scope,
      currentPeriod: {
        dataset: liveMetric.dataset,
        periodStart: liveMetric.periodStart,
        periodEnd: liveMetric.periodEnd,
        received: liveMetric.received,
        disposed: liveMetric.disposed,
        disposalRate: liveMetric.effectiveDisposalRate,
        totalPending: liveMetric.totalPending,
        agingBuckets: {
          '0_60_days': liveMetric.pending_0_60_days,
          '60_180_days': liveMetric.pending_60_180_days,
          '180_365_days': liveMetric.pending_180_365_days,
          'over_1_year': liveMetric.pending_more_than_1_year,
          total: liveMetric.totalPending,
        },
        pendingOverOneYear: liveMetric.pending_more_than_1_year,
      },
      appeals,
      historicalPerformance,
      source: this.getSourceInfo(liveMetric.dataset, canonicalEntity),
    };
  }

  /**
   * 4. DEPARTMENT RANKINGS
   */
  public getDepartmentRanking(
    sortBy: SortableDepartmentMetric = 'received',
    order: 'asc' | 'desc' = 'desc',
    filters?: QueryFilters
  ): PeriodDepartmentMetrics[] {
    const datasetName = filters?.dataset || 'live_dashboard_2026';
    const metrics = this.filterPeriodMetrics(
      this.getAllPeriodMetrics().filter(m => m.dataset === datasetName),
      filters
    );

    return [...metrics].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortBy) {
        case 'received':
          valA = a.received;
          valB = b.received;
          break;
        case 'disposed':
          valA = a.disposed;
          valB = b.disposed;
          break;
        case 'disposalRate':
          valA = a.effectiveDisposalRate;
          valB = b.effectiveDisposalRate;
          break;
        case 'totalPending':
          valA = a.totalPending;
          valB = b.totalPending;
          break;
        case 'pending_more_than_1_year':
          valA = a.pending_more_than_1_year;
          valB = b.pending_more_than_1_year;
          break;
      }

      const diff = valB - valA;
      return order === 'desc' ? diff : -diff;
    });
  }

  /**
   * 5. ATTENTION REQUIRED (Explainable Triage)
   */
  public getAttentionRequired(
    config?: AttentionCriteriaConfig,
    filters?: QueryFilters
  ): AttentionDetail[] {
    const datasetName = filters?.dataset || 'live_dashboard_2026';
    const metrics = this.filterPeriodMetrics(
      this.getAllPeriodMetrics().filter(m => m.dataset === datasetName),
      filters
    );

    const mergedConfig = {
      criticalPending1YearThreshold:
        config?.criticalPending1YearThreshold !== undefined
          ? config.criticalPending1YearThreshold
          : DEFAULT_ATTENTION_CONFIG.criticalPending1YearThreshold,
      criticalDisposalRateThreshold:
        config?.criticalDisposalRateThreshold !== undefined
          ? config.criticalDisposalRateThreshold
          : DEFAULT_ATTENTION_CONFIG.criticalDisposalRateThreshold,
      warningDisposalRateThreshold:
        config?.warningDisposalRateThreshold !== undefined
          ? config.warningDisposalRateThreshold
          : DEFAULT_ATTENTION_CONFIG.warningDisposalRateThreshold,
      warningPending180To365Threshold:
        config?.warningPending180To365Threshold !== undefined
          ? config.warningPending180To365Threshold
          : DEFAULT_ATTENTION_CONFIG.warningPending180To365Threshold,
    };

    const attentionList: AttentionDetail[] = [];

    for (const m of metrics) {
      // 1. Critical: >1 Year Pendency
      if (m.pending_more_than_1_year > mergedConfig.criticalPending1YearThreshold) {
        attentionList.push({
          entity: m.entity,
          scope: m.scope,
          dataset: m.dataset,
          periodKey: m.periodKey,
          severity: 'CRITICAL',
          reason: `${m.pending_more_than_1_year} grievances pending for more than 1 year`,
          metric: 'pending_more_than_1_year',
          value: m.pending_more_than_1_year,
          threshold: mergedConfig.criticalPending1YearThreshold,
        });
      }

      // 2. Critical: Disposal Rate < critical threshold
      if (m.effectiveDisposalRate < mergedConfig.criticalDisposalRateThreshold) {
        attentionList.push({
          entity: m.entity,
          scope: m.scope,
          dataset: m.dataset,
          periodKey: m.periodKey,
          severity: 'CRITICAL',
          reason: `Disposal rate of ${m.effectiveDisposalRate}% is below target operational threshold of ${mergedConfig.criticalDisposalRateThreshold}%`,
          metric: 'percent_disposed',
          value: m.effectiveDisposalRate,
          threshold: mergedConfig.criticalDisposalRateThreshold,
        });
      }

      // 3. Warning: Disposal Rate between critical and warning threshold
      if (
        m.effectiveDisposalRate >= mergedConfig.criticalDisposalRateThreshold &&
        m.effectiveDisposalRate < mergedConfig.warningDisposalRateThreshold
      ) {
        attentionList.push({
          entity: m.entity,
          scope: m.scope,
          dataset: m.dataset,
          periodKey: m.periodKey,
          severity: 'WARNING',
          reason: `Disposal rate of ${m.effectiveDisposalRate}% is below benchmark of ${mergedConfig.warningDisposalRateThreshold}%`,
          metric: 'percent_disposed',
          value: m.effectiveDisposalRate,
          threshold: mergedConfig.warningDisposalRateThreshold,
        });
      }

      // 4. Warning: Pending 180-365 Days
      if (m.pending_180_365_days > mergedConfig.warningPending180To365Threshold) {
        attentionList.push({
          entity: m.entity,
          scope: m.scope,
          dataset: m.dataset,
          periodKey: m.periodKey,
          severity: 'WARNING',
          reason: `High volume of grievances pending 180 to 365 days (${m.pending_180_365_days} cases)`,
          metric: 'pending_180_365_days',
          value: m.pending_180_365_days,
          threshold: mergedConfig.warningPending180To365Threshold,
        });
      }
    }

    // Sort CRITICAL first, then by value descending
    return attentionList.sort((a, b) => {
      if (a.severity === 'CRITICAL' && b.severity !== 'CRITICAL') return -1;
      if (a.severity !== 'CRITICAL' && b.severity === 'CRITICAL') return 1;
      return b.value - a.value;
    });
  }

  /**
   * 6. AGING ANALYSIS (System & Department Level)
   */
  public getAgingAnalysis(entityName?: string, datasetName: string = 'live_dashboard_2026'): AgingAnalysis {
    let metrics = this.getAllPeriodMetrics().filter(m => m.dataset === datasetName);

    if (entityName) {
      const searchKey = entityName.toLowerCase().trim();
      metrics = metrics.filter(m => m.entity.toLowerCase() === searchKey);
    }

    let p0_60 = 0;
    let p60_180 = 0;
    let p180_365 = 0;
    let p1Year = 0;
    let total = 0;

    for (const m of metrics) {
      p0_60 += m.pending_0_60_days;
      p60_180 += m.pending_60_180_days;
      p180_365 += m.pending_180_365_days;
      p1Year += m.pending_more_than_1_year;
      total += m.totalPending;
    }

    return {
      '0_60_days': p0_60,
      '60_180_days': p60_180,
      '180_365_days': p180_365,
      'over_1_year': p1Year,
      total,
    };
  }

  /**
   * 7. HISTORICAL TRENDS (Strict Dataset Separation)
   */
  public getHistoricalTrends(
    entityName?: string,
    targetDataset?: string
  ): HistoricalTrendSeries[] {
    const datasets = targetDataset
      ? [targetDataset]
      : Array.from(new Set(this.normalizedRows.map(r => r.dataset)));

    const seriesList: HistoricalTrendSeries[] = [];

    for (const ds of datasets) {
      // Filter rows for this specific dataset and optional entity
      let rows = this.normalizedRows.filter(r => r.dataset === ds);
      if (entityName) {
        const searchKey = entityName.toLowerCase().trim();
        rows = rows.filter(r => r.entity.toLowerCase() === searchKey);
      }

      if (rows.length === 0) continue;

      // Group by periodKey
      const periodGroup = new Map<string, { periodStart: string; periodEnd: string; metrics: Record<string, number> }>();

      for (const row of rows) {
        if (!periodGroup.has(row.periodKey)) {
          periodGroup.set(row.periodKey, {
            periodStart: row.periodStart,
            periodEnd: row.periodEnd,
            metrics: {},
          });
        }
        const grp = periodGroup.get(row.periodKey)!;
        grp.metrics[row.metric] = (grp.metrics[row.metric] || 0) + row.value;
      }

      const points = Array.from(periodGroup.entries()).map(([key, data]) => ({
        periodKey: key,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        label: data.periodStart && data.periodEnd ? `${data.periodStart} to ${data.periodEnd}` : key,
        metrics: data.metrics,
      })).sort((a, b) => (a.periodEnd || '').localeCompare(b.periodEnd || ''));

      seriesList.push({
        dataset: ds,
        scope: rows[0]?.scope || 'Department',
        entity: entityName,
        points,
        source: this.getSourceInfo(ds, entityName),
      });
    }

    return seriesList;
  }

  /**
   * 8. APPEALS OVERVIEW
   */
  public getAppealsOverview(filters?: QueryFilters): AppealsOverview {
    const appealDataset = 'appeal_dashboard_2026-08-25';
    let rows = this.normalizedRows.filter(r => r.dataset === appealDataset);

    if (filters?.entity) {
      const searchKey = filters.entity.toLowerCase().trim();
      rows = rows.filter(r => r.entity.toLowerCase().includes(searchKey));
    }

    const deptMap = new Map<string, { received: number; disposed: number; pending: number; rate: number }>();

    for (const r of rows) {
      if (!deptMap.has(r.entity)) {
        deptMap.set(r.entity, { received: 0, disposed: 0, pending: 0, rate: 0 });
      }
      const dept = deptMap.get(r.entity)!;
      if (r.metric === 'appeals_received') dept.received = r.value;
      if (r.metric === 'appeals_disposed') dept.disposed = r.value;
      if (r.metric === 'appeals_pending') dept.pending = r.value;
      if (r.metric === 'appeals_percent_disposed') dept.rate = r.value;
    }

    const deptList = Array.from(deptMap.entries()).map(([entity, stats]) => ({
      entity,
      received: stats.received,
      disposed: stats.disposed,
      pending: stats.pending,
      disposalRate: stats.rate || (stats.received > 0 ? Number(((stats.disposed / stats.received) * 100).toFixed(2)) : 0),
    })).sort((a, b) => b.received - a.received);

    let totalRec = 0;
    let totalDisp = 0;
    let totalPend = 0;

    for (const d of deptList) {
      totalRec += d.received;
      totalDisp += d.disposed;
      totalPend += d.pending;
    }

    const overallRate = totalRec > 0 ? Number(((totalDisp / totalRec) * 100).toFixed(2)) : 0;

    return {
      dataset: appealDataset,
      periodKey: 'as_of_2026-08-25',
      departmentCount: deptList.length,
      appealsReceived: totalRec,
      appealsDisposed: totalDisp,
      appealsPending: totalPend,
      appealDisposalRate: overallRate,
      departmentAppeals: deptList,
      source: this.getSourceInfo(appealDataset),
    };
  }

  /**
   * 9. GET METRIC (Arbitrary Metric Query with Filters)
   */
  public getMetric(metricName: string, filters?: QueryFilters): NormalizedMetricRow[] {
    const targetMetric = metricName.toLowerCase().trim();
    let rows = this.normalizedRows.filter(r => r.metric === targetMetric);

    if (filters?.scope) {
      rows = rows.filter(r => r.scope.toLowerCase() === filters.scope!.toLowerCase());
    }
    if (filters?.entity) {
      rows = rows.filter(r => r.entity.toLowerCase().includes(filters.entity!.toLowerCase()));
    }
    if (filters?.dataset) {
      rows = rows.filter(r => r.dataset === filters.dataset);
    }
    if (filters?.periodStart) {
      rows = rows.filter(r => r.periodStart === filters.periodStart);
    }
    if (filters?.periodEnd) {
      rows = rows.filter(r => r.periodEnd === filters.periodEnd);
    }

    return rows;
  }

  /**
   * 10. AVAILABLE ENTITIES
   */
  public getAvailableEntities(filters?: QueryFilters): string[] {
    let rows = this.normalizedRows;
    if (filters?.dataset) {
      rows = rows.filter(r => r.dataset === filters.dataset);
    }
    if (filters?.scope) {
      rows = rows.filter(r => r.scope.toLowerCase() === filters.scope!.toLowerCase());
    }
    const entities = Array.from(new Set(rows.map(r => r.entity)));
    return entities.sort((a, b) => a.localeCompare(b));
  }

  /**
   * 11. AVAILABLE PERIODS
   */
  public getAvailablePeriods(datasetName?: string): Array<{ dataset: string; periodStart: string; periodEnd: string; periodKey: string }> {
    let rows = this.normalizedRows;
    if (datasetName) {
      rows = rows.filter(r => r.dataset === datasetName);
    }

    const periodMap = new Map<string, { dataset: string; periodStart: string; periodEnd: string; periodKey: string }>();

    for (const r of rows) {
      const key = `${r.dataset}:::${r.periodKey}`;
      if (!periodMap.has(key)) {
        periodMap.set(key, {
          dataset: r.dataset,
          periodStart: r.periodStart,
          periodEnd: r.periodEnd,
          periodKey: r.periodKey,
        });
      }
    }

    return Array.from(periodMap.values());
  }

  /**
   * 12. AVAILABLE METRICS
   */
  public getAvailableMetrics(datasetName?: string): string[] {
    let rows = this.normalizedRows;
    if (datasetName) {
      rows = rows.filter(r => r.dataset === datasetName);
    }
    return Array.from(new Set(rows.map(r => r.metric))).sort();
  }
}

/**
 * Singleton factory helper
 */
let serviceInstance: CpgramsService | null = null;

export function initializeCpgramsService(rows: NormalizedMetricRow[]): CpgramsService {
  serviceInstance = new CpgramsService(rows);
  return serviceInstance;
}

export function getCpgramsService(): CpgramsService {
  if (!serviceInstance) {
    throw new Error('CpgramsService is not initialized. Call initializeCpgramsService() first.');
  }
  return serviceInstance;
}
