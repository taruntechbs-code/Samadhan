/**
 * SAMADHAN — CPGRAMS Real Data Engine Types
 * Strongly typed definitions for raw, normalized, aggregated, and analytics metrics.
 */

export const CORE_METRICS = [
  'received',
  'disposed',
  'percent_disposed',
  'pending_0_60_days',
  'pending_60_180_days',
  'pending_180_365_days',
  'pending_more_than_1_year',
] as const;

export const ALL_KNOWN_METRICS = [
  ...CORE_METRICS,
  'receipts',
  'brought_forward',
  'pending',
  'total',
  'appeals_received',
  'appeals_disposed',
  'appeals_percent_disposed',
  'appeals_pending',
  'grievances_received',
  'grievances_redressed',
  'pendency',
  'average_disposal_days',
  'new_users_registered',
  'feedback_total',
  'feedback_central',
  'feedback_states_ut',
  'grievances_through_csc',
  'review_meetings_cumulative',
  'review_meetings_in_month',
  'states_ut_with_over_1000_pending',
  'top_disposal_count',
  'second_disposal_count',
  'training_courses_cumulative',
  'officers_trained_cumulative',
] as const;

export type CoreMetric = typeof CORE_METRICS[number];
export type KnownMetric = typeof ALL_KNOWN_METRICS[number];

/**
 * Raw row straight from 10_MASTER_verified_cpgrams_metrics_long.csv
 */
export interface RawCpgramsRow {
  dataset: string;
  scope: string;
  entity: string;
  period_start: string;
  period_end: string;
  metric: string;
  value: string | number;
  unit: string;
  source_url: string;
  source_note: string;
}

/**
 * Normalized row after validation & parsing
 */
export interface NormalizedMetricRow {
  dataset: string;
  scope: string;
  entity: string;
  periodStart: string;
  periodEnd: string;
  periodKey: string;
  metric: string;
  isCoreMetric: boolean;
  value: number;
  unit: string;
  sourceUrl: string;
  sourceNote: string;
}

/**
 * Period-level metrics for a single department/entity
 */
export interface PeriodDepartmentMetrics {
  entity: string;
  scope: string;
  dataset: string;
  periodStart: string;
  periodEnd: string;
  periodKey: string;
  
  // Volume metrics
  received: number;
  disposed: number;
  
  // Official dataset disposal rate vs calculated
  sourcePercentDisposed: number | null;
  calculatedDisposalRate: number | null;
  effectiveDisposalRate: number;

  // Pending breakdown buckets
  pending_0_60_days: number;
  pending_60_180_days: number;
  pending_180_365_days: number;
  pending_more_than_1_year: number;

  // Calculated total pending (sum of 4 buckets or fallback to direct pending/pendency)
  totalPending: number;

  // Raw metrics map for all metrics in this record
  rawMetrics: Record<string, number>;
}

/**
 * Department Summary spanning historical periods and current standing
 */
export interface DepartmentSummary {
  entity: string;
  scope: string;
  datasets: string[];
  latestPeriodKey: string;
  latestMetrics: PeriodDepartmentMetrics;
  historicalPeriods: PeriodDepartmentMetrics[];
  
  // Cumulative or latest indicators
  totalReceived: number;
  totalDisposed: number;
  currentTotalPending: number;
  currentPendingMoreThan1Year: number;
  currentDisposalRate: number;
  
  // Attention flags
  isAttentionRequired: boolean;
  attentionSeverity?: 'CRITICAL' | 'WARNING' | 'NORMAL';
  attentionReasons: string[];
}

/**
 * System-wide aggregate totals for a specific period
 */
export interface SystemLevelTotals {
  periodKey: string;
  periodStart: string;
  periodEnd: string;
  dataset: string;
  departmentCount: number;
  totalReceived: number;
  totalDisposed: number;
  overallDisposalRate: number; // (totalDisposed / totalReceived) * 100
  averageDisposalRate: number; // average of department rates
  
  // Aggregate pending buckets
  totalPending_0_60: number;
  totalPending_60_180: number;
  totalPending_180_365: number;
  totalPending_more_than_1_year: number;
  totalPending: number;
  
  criticalDepartmentsCount: number;
  warningDepartmentsCount: number;
}

/**
 * Attention-Required Department entry for audit/monitoring
 */
export interface AttentionRequiredItem {
  entity: string;
  scope: string;
  dataset: string;
  periodKey: string;
  severity: 'CRITICAL' | 'WARNING';
  reasons: string[];
  pending_more_than_1_year: number;
  effectiveDisposalRate: number;
  totalPending: number;
  received: number;
  disposed: number;
}

/**
 * Configurable rules for determining attention severity
 */
export interface AttentionCriteriaConfig {
  criticalPending1YearThreshold?: number;
  criticalDisposalRateThreshold?: number;
  warningDisposalRateThreshold?: number;
  warningPending180To365Threshold?: number;
}

/**
 * Trend point for historical analysis
 */
export interface DepartmentTrendPoint {
  dataset: string;
  periodKey: string;
  periodStart: string;
  periodEnd: string;
  received: number;
  disposed: number;
  disposalRate: number;
  totalPending: number;
  pending_more_than_1_year: number;
}

/**
 * Parse & Load Result
 */
export interface CsvLoadResult {
  rawRowCount: number;
  validRowCount: number;
  skippedRowCount: number;
  errors: string[];
  normalizedRows: NormalizedMetricRow[];
}
