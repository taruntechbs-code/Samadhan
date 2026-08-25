/**
 * SAMADHAN — Service Layer Type Definitions
 * Typed contracts for intelligence queries, filters, aging breakdowns, appeals, and traceability.
 */

export interface QueryFilters {
  scope?: string;
  entity?: string;
  dataset?: string;
  periodStart?: string;
  periodEnd?: string;
  metric?: string;
  minDisposalRate?: number;
  maxDisposalRate?: number;
}

export interface AgingAnalysis {
  '0_60_days': number;
  '60_180_days': number;
  '180_365_days': number;
  'over_1_year': number;
  total: number;
}

export interface SourceTraceability {
  dataset: string;
  periodStart: string;
  periodEnd: string;
  sourceUrl: string;
  sourceNote: string;
}

export interface SystemOverview {
  dataset: string;
  periodStart: string;
  periodEnd: string;
  periodKey: string;
  received: number;
  disposed: number;
  disposalRate: number;
  pending: number;
  agingBuckets: AgingAnalysis;
  entities: number;
  scopes: string[];
  periods: string[];
  criticalEntitiesCount: number;
  warningEntitiesCount: number;
  source: SourceTraceability;
}

export interface DepartmentDetail {
  entity: string;
  scope: string;
  currentPeriod: {
    dataset: string;
    periodStart: string;
    periodEnd: string;
    received: number;
    disposed: number;
    disposalRate: number;
    totalPending: number;
    agingBuckets: AgingAnalysis;
    pendingOverOneYear: number;
  };
  appeals?: {
    received: number;
    disposed: number;
    pending: number;
    disposalRate: number;
  };
  historicalPerformance: Array<{
    dataset: string;
    periodStart: string;
    periodEnd: string;
    periodKey: string;
    received: number;
    disposed: number;
    disposalRate: number;
    totalPending: number;
    rawMetrics: Record<string, number>;
  }>;
  source: SourceTraceability;
}

export interface AttentionDetail {
  entity: string;
  scope: string;
  dataset: string;
  periodKey: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  reason: string;
  metric: string;
  value: number;
  threshold: number;
}

export interface AppealsOverview {
  dataset: string;
  periodKey: string;
  departmentCount: number;
  appealsReceived: number;
  appealsDisposed: number;
  appealsPending: number;
  appealDisposalRate: number;
  departmentAppeals: Array<{
    entity: string;
    received: number;
    disposed: number;
    pending: number;
    disposalRate: number;
  }>;
  source: SourceTraceability;
}

export interface HistoricalTrendSeries {
  dataset: string;
  scope: string;
  entity?: string;
  points: Array<{
    periodKey: string;
    periodStart: string;
    periodEnd: string;
    label: string;
    metrics: Record<string, number>;
  }>;
  source: SourceTraceability;
}

export type SortableDepartmentMetric =
  | 'received'
  | 'disposed'
  | 'disposalRate'
  | 'totalPending'
  | 'pending_more_than_1_year';
