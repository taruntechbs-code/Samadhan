/**
 * SAMADHAN — Central Dataset Registry
 * Official metadata registry for all CPGRAMS, Facility Directory, and Municipal data sources.
 * Enforces strict provenance distinction and dataset isolation.
 */

export type DatasetCategory =
  | 'CPGRAMS_CURRENT'
  | 'CPGRAMS_HISTORICAL'
  | 'MUNICIPAL_CASE_STUDY'
  | 'FACILITY_DIRECTORY';

export interface DatasetSource {
  id: string;
  name: string;
  publisher: string;
  url: string;
  category: DatasetCategory;
  periodStart?: string;
  periodEnd?: string;
  recordCount?: number;
  description: string;
  usageInSamadhan: string;
}

export const DATASET_REGISTRY: Record<string, DatasetSource> = {
  cpgramsCurrentLive: {
    id: 'live_dashboard_2026',
    name: 'CPGRAMS Central Live Dashboard Telemetry',
    publisher: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    url: 'https://pgportal.gov.in/darpgdashboard',
    category: 'CPGRAMS_CURRENT',
    periodStart: '2026-01-01',
    periodEnd: '2026-08-24',
    recordCount: 889,
    description: 'Current real-time operational receipts, disposals, disposal percentages, and 4-tier aging pendency metrics across 127 reporting departments and States/UTs.',
    usageInSamadhan: 'Powers real-time Executive KPIs, Aging Analysis, Operational Risk Engine (0-100), and Attention Action Cockpit.',
  },

  cpgramsAppeals: {
    id: 'appeal_dashboard_2026-08-25',
    name: 'CPGRAMS Appellate Redressal Telemetry',
    publisher: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    url: 'https://pgportal.gov.in/darpgdashboard',
    category: 'CPGRAMS_CURRENT',
    periodStart: 'start',
    periodEnd: '2026-08-25',
    recordCount: 352,
    description: 'Official secondary appeals receipts, disposals, and pending cases across 88 central ministries.',
    usageInSamadhan: 'Powers Secondary Appeals Intelligence Card and appellate redressal rate analytics.',
  },

  cpgramsHistoricalDetailed: {
    id: 'department_history_2016_2026-02-28',
    name: 'Department-Wise Historical Receipts & Disposal (2016–2026)',
    publisher: 'Department of Administrative Reforms and Public Grievances (DARPG) / Open Government Data Platform',
    url: 'https://www.data.gov.in/resource/department-wise-receipts-disposal-and-pendency-public-grievance-detailed-statistics',
    category: 'CPGRAMS_HISTORICAL',
    periodStart: '2016-01-01',
    periodEnd: '2026-02-28',
    recordCount: 178,
    description: '10-year longitudinal series tracking cumulative receipts, redressed cases, pendency, and average disposal time in days across central ministries.',
    usageInSamadhan: 'Provides historical baseline disposal rates, volume baselines, and current-vs-historical delta variance analysis.',
  },

  cpgramsHistoricalMonthly: {
    id: 'monthly_central_2026',
    name: 'Monthly Central Grievance Progress Reports (Jan–Jun 2026)',
    publisher: 'Department of Administrative Reforms and Public Grievances (DARPG) / Open Government Data Platform',
    url: 'https://www.data.gov.in/resource/monthly-department-wise-public-grievance-receipts-and-disposals-january-2016-octorber-2019',
    category: 'CPGRAMS_HISTORICAL',
    periodStart: '2026-01-01',
    periodEnd: '2026-06-30',
    recordCount: 468,
    description: 'Month-by-month progress snapshots capturing new user registrations, feedback ratings, CSC submissions, and review meetings.',
    usageInSamadhan: 'Supplies high-resolution temporal trajectory analysis and seasonal velocity detection.',
  },

  facilityDirectory: {
    id: 'facility_directory',
    name: 'National Public Healthcare Facility Directory',
    publisher: 'National Health Authority (NHA) / Ministry of Health & Family Welfare',
    url: 'https://facility.ndhm.gov.in',
    category: 'FACILITY_DIRECTORY',
    periodStart: '2025-01-01',
    periodEnd: '2026-08-25',
    recordCount: 200440,
    description: 'Master administrative facility catalog indexing PHCs, CHCs, and hospitals with district, subdistrict, state, and active operational flags.',
    usageInSamadhan: 'Provides local geographic jurisdiction resolution and facility context for healthcare grievances without affecting central CPGRAMS metrics.',
  },

  pcmcMunicipalCaseStudy: {
    id: 'pcmc_grievance_2025',
    name: 'PCMC Municipal Citizen Grievance Case Study (2025)',
    publisher: 'Pimpri Chinchwad Municipal Corporation / Open Government Data Platform',
    url: 'https://www.data.gov.in/resource/pcmc-grievance-data-during-2025',
    category: 'MUNICIPAL_CASE_STUDY',
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    description: 'Municipal-level grievance intake, ward-wise distribution, and civic category redressal telemetry.',
    usageInSamadhan: 'Isolated municipal case-study demonstration proving SAMADHAN architecture extends to local urban local bodies (ULBs). Strictly segregated from national CPGRAMS aggregates.',
  },
};

export function getDatasetMetadata(datasetId: string): DatasetSource | null {
  return DATASET_REGISTRY[datasetId] || Object.values(DATASET_REGISTRY).find(d => d.id === datasetId) || null;
}

export function getAllDatasets(): DatasetSource[] {
  return Object.values(DATASET_REGISTRY);
}
