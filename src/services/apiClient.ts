/**
 * SAMADHAN — Frontend API Client & Service Bridge
 * Provides typed methods calling /api with seamless client-side dataset initialization fallback.
 */

import {
  SystemOverview,
  DepartmentDetail,
  AppealsOverview,
  HistoricalTrendSeries,
  QueryFilters,
  SortableDepartmentMetric,
} from './types';
import { DepartmentSummary } from '../data/types';
import {
  SystemInsight,
  DepartmentInsight,
  RoutingRecommendation,
  SystemMetadata,
} from '../intelligence/types';
import { loadCpgramsDataset } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from './cpgramsService';
import {
  getSystemInsights,
  getDepartmentInsights,
  routeGrievanceText,
  calculateDepartmentRisk,
  generateDepartmentRecommendations,
} from '../intelligence';

let clientServicePromise: Promise<CpgramsService> | null = null;

async function getClientCpgramsService(): Promise<CpgramsService> {
  if (!clientServicePromise) {
    clientServicePromise = (async () => {
      const res = await loadCpgramsDataset('/10_MASTER_verified_cpgrams_metrics_long.csv');
      return initializeCpgramsService(res.normalizedRows);
    })();
  }
  return clientServicePromise;
}

// 0. System Metadata
export async function fetchSystemMetadata(): Promise<SystemMetadata> {
  try {
    const res = await fetch('/api/meta');
    if (res.ok) return await res.json();
  } catch {}
  return {
    version: '0.6.0',
    name: 'SAMADHAN — Public Grievance Redressal & Intelligence Platform',
    description: 'Civic-tech modernization of India’s CPGRAMS public grievance experience.',
    event: 'Build What Moves India',
    totalRowsParsed: 2134,
    reportingEntitiesCount: 278,
    availableDatasets: [
      'live_dashboard_2026',
      'appeal_dashboard_2026-08-25',
      'department_history_2016_2026-02-28',
      'state_history_2016_2026-02-28',
      'state_cpgrams_2020_2024',
      'year_wise_cpgrams',
      'monthly_central_2026',
      'monthly_states_ut_2026',
    ],
    availableMetrics: ['received', 'disposed', 'percent_disposed', 'appeals_received', 'appeals_disposed'],
    livePeriod: '2026-01-01 to 2026-08-24',
    intelligenceEngineVersion: '2.0.0-phase6',
    methodology: {
      riskScoring: 'Deterministic 0-100 scoring based on disposal velocity benchmarks, chronic 1-year pendency, and 180-365 day aging volume.',
      routingModel: 'Deterministic word-boundary taxonomy matching mapping citizen problem vocabulary to 278 real public authorities.',
      datasetIntegrity: 'Strict dataset isolation; live dashboards, monthly central reports, 10-year longitudinal series, and appeals are maintained in separate analytical partitions.',
    },
  };
}

// 1. System Overview
export async function fetchSystemOverview(
  dataset: string = 'live_dashboard_2026',
  scope?: string
): Promise<SystemOverview> {
  try {
    const res = await fetch(`/api/overview?dataset=${encodeURIComponent(dataset)}${scope ? `&scope=${encodeURIComponent(scope)}` : ''}`);
    if (res.ok) return await res.json();
  } catch {}
  const service = await getClientCpgramsService();
  return service.getSystemOverview(dataset, scope ? { scope } : undefined);
}

// 2. Department Summaries
export async function fetchDepartmentSummaries(filters?: QueryFilters): Promise<DepartmentSummary[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.scope) params.set('scope', filters.scope);
    if (filters?.entity) params.set('entity', filters.entity);
    if (filters?.minDisposalRate !== undefined) params.set('minDisposalRate', String(filters.minDisposalRate));
    const res = await fetch(`/api/departments?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.departments;
    }
  } catch {}
  const service = await getClientCpgramsService();
  return service.getDepartmentSummaries(filters);
}

// 3. Department Rankings
export async function fetchDepartmentRanking(
  sortBy: SortableDepartmentMetric = 'received',
  order: 'asc' | 'desc' = 'desc',
  filters?: QueryFilters
) {
  try {
    const params = new URLSearchParams({ sortBy, order });
    if (filters?.scope) params.set('scope', filters.scope);
    if (filters?.dataset) params.set('dataset', filters.dataset);
    const res = await fetch(`/api/departments/ranking?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.ranking;
    }
  } catch {}
  const service = await getClientCpgramsService();
  return service.getDepartmentRanking(sortBy, order, filters);
}

// 4. Department Detail
export async function fetchDepartmentByName(entityName: string): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(`/api/departments/${encodeURIComponent(entityName)}`);
    if (res.ok) return await res.json();
  } catch {}
  const service = await getClientCpgramsService();
  return service.getDepartmentByName(entityName);
}

// 5. System Intelligence Insights
export async function fetchSystemInsights(): Promise<SystemInsight> {
  try {
    const res = await fetch('/api/intelligence/overview');
    if (res.ok) return await res.json();
  } catch {}
  const service = await getClientCpgramsService();
  return getSystemInsights(service);
}

// 6. Department Intelligence Insights
export async function fetchDepartmentInsights(entityName: string): Promise<DepartmentInsight | null> {
  try {
    const res = await fetch(`/api/intelligence/departments/${encodeURIComponent(entityName)}`);
    if (res.ok) return await res.json();
  } catch {}
  const service = await getClientCpgramsService();
  return getDepartmentInsights(entityName, service);
}

// 7. Grievance Routing
export async function routeGrievance(text: string): Promise<RoutingRecommendation> {
  try {
    const res = await fetch(`/api/intelligence/routing?text=${encodeURIComponent(text)}`);
    if (res.ok) return await res.json();
  } catch {}
  return routeGrievanceText(text);
}

// 8. Appeals Overview
export async function fetchAppealsOverview(entity?: string): Promise<AppealsOverview> {
  try {
    const res = await fetch(`/api/appeals${entity ? `?entity=${encodeURIComponent(entity)}` : ''}`);
    if (res.ok) return await res.json();
  } catch {}
  const service = await getClientCpgramsService();
  return service.getAppealsOverview(entity ? { entity } : undefined);
}

// 9. Historical Trends
export async function fetchHistoricalTrends(entity?: string, dataset?: string): Promise<HistoricalTrendSeries[]> {
  try {
    const params = new URLSearchParams();
    if (entity) params.set('entity', entity);
    if (dataset) params.set('dataset', dataset);
    const res = await fetch(`/api/trends?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.series;
    }
  } catch {}
  const service = await getClientCpgramsService();
  return service.getHistoricalTrends(entity, dataset);
}

// 10. Attention Required Enriched
export async function fetchEnrichedAttention(dataset: string = 'live_dashboard_2026', scope?: string) {
  try {
    const res = await fetch(`/api/intelligence/attention?dataset=${encodeURIComponent(dataset)}${scope ? `&scope=${encodeURIComponent(scope)}` : ''}`);
    if (res.ok) {
      const data = await res.json();
      return data.items;
    }
  } catch {}
  const service = await getClientCpgramsService();
  const rawAttention = service.getAttentionRequired(undefined, { dataset, scope });
  return rawAttention.map(item => {
    const periodMetric = service.getDepartmentRanking('received', 'desc', { dataset, scope }).find(
      m => m.entity.toLowerCase() === item.entity.toLowerCase()
    );
    const risk = periodMetric ? calculateDepartmentRisk(periodMetric) : null;
    const recommendations = periodMetric ? generateDepartmentRecommendations(periodMetric) : [];
    return {
      entity: item.entity,
      scope: item.scope,
      dataset: item.dataset,
      severity: item.severity,
      riskScore: risk?.riskScore || 0,
      reasons: [item.reason],
      recommendations,
      evidence: risk?.evidence || [],
    };
  });
}

// ==========================================
// CITIZEN LOCAL STORAGE TRACKING HELPERS
// ==========================================

export interface CitizenGrievanceRecord {
  id: string; // e.g. SAM-2026-8492
  title: string;
  description: string;
  category: string;
  routedEntity: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED';
  applicantName: string;
  mobile: string;
  timeline: Array<{
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
}

const STORAGE_KEY = 'samadhan_citizen_grievances';

const SAMPLE_GRIEVANCES: CitizenGrievanceRecord[] = [
  {
    id: 'SAM-2026-1042',
    title: 'Income Tax Return Refund Delayed for AY 2025-26',
    description: 'ITR-1 filed and e-verified on June 15, 2025. Refund of ₹14,200 is still shown as processing.',
    category: 'Income Tax & Direct Taxation',
    routedEntity: 'Central Board of Direct Taxes (Income Tax)',
    submittedAt: '2026-08-10',
    status: 'IN_PROGRESS',
    applicantName: 'Rajesh Sharma',
    mobile: '98765*****',
    timeline: [
      { title: 'Grievance Lodged', description: 'Submitted via SAMADHAN AI Assistant', timestamp: '10 Aug 2026, 10:30 AM', completed: true },
      { title: 'Authority Acknowledged', description: 'Allocated to Nodal Officer, Assessment Unit 4', timestamp: '12 Aug 2026, 02:15 PM', completed: true },
      { title: 'Verification in Progress', description: 'Refund reconciliation with CPC Bengaluru underway', timestamp: '18 Aug 2026, 11:00 AM', completed: true },
      { title: 'Resolution & Closure', description: 'Final order and refund intimation notice issue', timestamp: 'Expected within 5 business days', completed: false },
    ],
  },
  {
    id: 'SAM-2026-2849',
    title: 'EPFO Transfer of Previous Account PF Balance',
    description: 'Online transfer request rejected twice without specifying reason from previous employer establishment.',
    category: 'Labour, EPFO & Pensions',
    routedEntity: 'Labour and Employment',
    submittedAt: '2026-08-18',
    status: 'UNDER_REVIEW',
    applicantName: 'Priya Sundaram',
    mobile: '91234*****',
    timeline: [
      { title: 'Grievance Lodged', description: 'Submitted via SAMADHAN Natural Routing', timestamp: '18 Aug 2026, 04:45 PM', completed: true },
      { title: 'Nodal Verification', description: 'Forwarded to Regional P.F. Commissioner II', timestamp: '20 Aug 2026, 09:30 AM', completed: true },
      { title: 'Field Action', description: 'Employer establishment notice dispatched', timestamp: 'Pending verification', completed: false },
      { title: 'Resolution', description: 'PF transfer completion intimation', timestamp: 'Pending', completed: false },
    ],
  },
];

export function getStoredCitizenGrievances(): CitizenGrievanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_GRIEVANCES));
      return SAMPLE_GRIEVANCES;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_GRIEVANCES;
  }
}

export function saveCitizenGrievance(
  data: Omit<CitizenGrievanceRecord, 'id' | 'submittedAt' | 'status' | 'timeline'>
): CitizenGrievanceRecord {
  const existing = getStoredCitizenGrievances();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = `SAM-2026-${randomNum}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const newRecord: CitizenGrievanceRecord = {
    ...data,
    id,
    submittedAt: nowStr,
    status: 'SUBMITTED',
    timeline: [
      {
        title: 'Grievance Lodged',
        description: 'Auto-categorized and routed by SAMADHAN Intelligence Engine',
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        title: 'Dispatched to Authority',
        description: `Transmitted directly to ${data.routedEntity}`,
        timestamp: 'In transit to central redressal cell',
        completed: false,
      },
      {
        title: 'Officer Review & Action',
        description: 'Nodal officer assigned for inquiry and resolution',
        timestamp: 'Scheduled SLA: within 30 days',
        completed: false,
      },
      {
        title: 'Resolution & Closure',
        description: 'Citizen satisfaction feedback and final redressal intimation',
        timestamp: 'Final stage',
        completed: false,
      },
    ],
  };

  const updated = [newRecord, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return newRecord;
}

export function getGrievanceByRef(referenceNumber: string): CitizenGrievanceRecord | null {
  const list = getStoredCitizenGrievances();
  const search = referenceNumber.trim().toUpperCase();
  const found = list.find(g => g.id.toUpperCase() === search);
  return found || null;
}
