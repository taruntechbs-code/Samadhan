/**
 * SAMADHAN — Types & Interfaces
 */

export interface CpgramsMetricRow {
  dataset: string;
  scope: string;
  entity: string;
  period_start: string;
  period_end: string;
  metric: string;
  value: number;
  unit: string;
  source_url: string;
  source_note: string;
}

export type GrievanceStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface NavItem {
  label: string;
  path: string;
  iconName: string;
}
