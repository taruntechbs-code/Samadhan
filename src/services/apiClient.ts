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
import { FacilityRecord } from '../data/facilityDirectory';
export type { FacilityRecord };
import { loadCpgramsDataset } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from './cpgramsService';
import {
  getSystemInsights,
  getDepartmentInsights,
  routeGrievanceText,
  calculateDepartmentRisk,
  generateDepartmentRecommendations,
  ExtractedDocument,
  MultiDocumentEvidence,
  aggregateMultiDocumentEvidence,
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
    if (res.ok) return (await res.json()) as SystemMetadata;
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
    if (res.ok) return (await res.json()) as SystemOverview;
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
      const data = (await res.json()) as any;
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
      const data = (await res.json()) as any;
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
    if (res.ok) return (await res.json()) as DepartmentDetail | null;
  } catch {}
  const service = await getClientCpgramsService();
  return service.getDepartmentByName(entityName);
}

// 5. System Intelligence Insights
export async function fetchSystemInsights(): Promise<SystemInsight> {
  try {
    const res = await fetch('/api/intelligence/overview');
    if (res.ok) return (await res.json()) as SystemInsight;
  } catch {}
  const service = await getClientCpgramsService();
  return getSystemInsights(service);
}

// 6. Department Intelligence Insights
export async function fetchDepartmentInsights(entityName: string): Promise<DepartmentInsight | null> {
  try {
    const res = await fetch(`/api/intelligence/departments/${encodeURIComponent(entityName)}`);
    if (res.ok) return (await res.json()) as DepartmentInsight | null;
  } catch {}
  const service = await getClientCpgramsService();
  return getDepartmentInsights(entityName, service);
}

// 7. Grievance Routing (supports plain text and document evidence)
export async function routeGrievance(
  text: string,
  documents?: ExtractedDocument[]
): Promise<RoutingRecommendation> {
  try {
    if (!documents || documents.length === 0) {
      const res = await fetch(`/api/intelligence/routing?text=${encodeURIComponent(text)}`);
      if (res.ok) return (await res.json()) as RoutingRecommendation;
    } else {
      const res = await fetch('/api/evidence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: text, documents }),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.routing) return data.routing;
      }
    }
  } catch {}
  return routeGrievanceText(text, documents);
}

// 7b. Document Evidence Analysis
export async function analyzeEvidenceDocuments(
  documents: ExtractedDocument[],
  queryText?: string
): Promise<MultiDocumentEvidence> {
  try {
    const res = await fetch('/api/evidence/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText, documents }),
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      return data.evidence;
    }
  } catch {}
  return aggregateMultiDocumentEvidence(documents, queryText);
}

// 8. Appeals Overview
export async function fetchAppealsOverview(entity?: string): Promise<AppealsOverview> {
  try {
    const res = await fetch(`/api/appeals${entity ? `?entity=${encodeURIComponent(entity)}` : ''}`);
    if (res.ok) return (await res.json()) as AppealsOverview;
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
      const data = (await res.json()) as any;
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
      const data = (await res.json()) as any;
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
    title: 'Delayed Income Tax Refund AY 2025-26',
    description: 'ITR e-verified in July 2025 but refund of ₹18,500 is still pending after 6 months.',
    category: 'Income Tax & Direct Taxation',
    routedEntity: 'Central Board of Direct Taxes (Income Tax)',
    submittedAt: '2026-08-10',
    status: 'IN_PROGRESS',
    applicantName: 'Ramesh Kumar Verma',
    mobile: '+91 98765 43210',
    timeline: [
      {
        title: 'Grievance Lodged',
        description: 'Successfully registered via SAMADHAN AI Intake',
        timestamp: '10 Aug 2026, 10:30 AM',
        completed: true,
      },
      {
        title: 'Assigned to Nodal Officer',
        description: 'Transmitted to Central Board of Direct Taxes Redressal Cell (Officer ID: CBDT-ND-842)',
        timestamp: '11 Aug 2026, 02:15 PM',
        completed: true,
      },
      {
        title: 'Under Technical Inquiry',
        description: 'Refund processing cell initiated bank validation re-check',
        timestamp: '14 Aug 2026, 11:00 AM',
        completed: true,
      },
      {
        title: 'Resolution & Closure',
        description: 'Refund credit scheduled within 7 business days',
        timestamp: 'Target SLA: 25 Aug 2026',
        completed: false,
      },
    ],
  },
  {
    id: 'SAM-2026-1088',
    title: 'Tatkal Ticket Cancellation Refund Not Credited',
    description: 'Auto-cancelled waitlisted ticket #2847192841, refund amount ₹2,450 not received.',
    category: 'Railways & Train Services',
    routedEntity: 'Railway Board',
    submittedAt: '2026-08-15',
    status: 'UNDER_REVIEW',
    applicantName: 'Priya Sharma',
    mobile: '+91 91234 56789',
    timeline: [
      {
        title: 'Grievance Lodged',
        description: 'Registered and routed to Railway Board',
        timestamp: '15 Aug 2026, 04:20 PM',
        completed: true,
      },
      {
        title: 'Assigned to IRCTC Nodal Desk',
        description: 'Pending bank payment gateway audit',
        timestamp: '16 Aug 2026, 09:45 AM',
        completed: true,
      },
      {
        title: 'Resolution & Closure',
        description: 'Target SLA: 30 Aug 2026',
        timestamp: 'Pending',
        completed: false,
      },
    ],
  },
  {
    id: 'SAM-2026-0912',
    title: 'EPFO Transfer Claim Settlement',
    description: 'Provident fund balance transfer from previous establishment in Pune.',
    category: 'Labour, EPFO & Pensions',
    routedEntity: 'Labour and Employment',
    submittedAt: '2026-07-28',
    status: 'RESOLVED',
    applicantName: 'Anil Deshmukh',
    mobile: '+91 99887 76655',
    timeline: [
      {
        title: 'Grievance Lodged',
        description: 'Registered with UAN details',
        timestamp: '28 Jul 2026, 11:15 AM',
        completed: true,
      },
      {
        title: 'Nodal Officer Action',
        description: 'Regional EPFO Office Pune reconciled Member ID records',
        timestamp: '30 Jul 2026, 03:00 PM',
        completed: true,
      },
      {
        title: 'Resolved',
        description: 'Transfer claim settled and credited to current account (Claim ID: PN-28491)',
        timestamp: '05 Aug 2026, 04:30 PM',
        completed: true,
      },
    ],
  },
];

let memoryGrievances: CitizenGrievanceRecord[] = [...SAMPLE_GRIEVANCES];

export function getStoredCitizenGrievances(): CitizenGrievanceRecord[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {}
  return memoryGrievances;
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
  memoryGrievances = updated;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {}

  return newRecord;
}

export function getGrievanceByRef(referenceNumber: string): CitizenGrievanceRecord | null {
  const list = getStoredCitizenGrievances();
  const search = referenceNumber.trim().toUpperCase();
  const found = list.find(g => g.id.toUpperCase() === search);
  return found || null;
}

// 7. Facility Directory Enrichment
export interface FacilitySearchResults {
  source: string;
  sourceNote?: string;
  total: number;
  limit: number;
  results: FacilityRecord[];
}

export async function fetchFacilitySearch(query: {
  q?: string;
  state?: string;
  district?: string;
  subdistrict?: string;
  facilityType?: string;
  limit?: number;
}): Promise<FacilitySearchResults> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.state) params.set('state', query.state);
  if (query.district) params.set('district', query.district);
  if (query.subdistrict) params.set('subdistrict', query.subdistrict);
  if (query.facilityType) params.set('facilityType', query.facilityType);
  if (query.limit) params.set('limit', String(query.limit));

  try {
    const res = await fetch(`/api/facilities/search?${params.toString()}`);
    if (res.ok) {
      return (await res.json()) as FacilitySearchResults;
    }
  } catch (err) {
    console.warn('Facility search API unavailable:', err);
  }

  return {
    source: 'facility_directory',
    total: 0,
    limit: query.limit || 10,
    results: [],
  };
}

export const fetchFacilitiesSearch = fetchFacilitySearch;

export async function fetchFacilityById(id: string): Promise<FacilityRecord | null> {
  try {
    const res = await fetch(`/api/facilities/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = (await res.json()) as any;
      return data.facility || null;
    }
  } catch (err) {
    console.warn('Facility detail API unavailable:', err);
  }
  return null;
}

// 8. Dataset Registry
export async function fetchDatasets() {
  try {
    const res = await fetch('/api/datasets');
    if (res.ok) {
      const data = (await res.json()) as any;
      return data.datasets || [];
    }
  } catch (err) {
    console.warn('Dataset registry API unavailable:', err);
  }
  return [];
}

import {
  DepartmentHistoricalProfile,
  HistoricalSystemOverview,
  getAllHistoricalComparisons,
  getDepartmentHistoricalComparison,
  getHistoricalSystemOverview,
} from '../data/cpgramsHistorical';
import { getMunicipalCaseStudy, MunicipalCaseStudyProfile } from '../data/municipal/pcmc';

export type { DepartmentHistoricalProfile, HistoricalSystemOverview, MunicipalCaseStudyProfile };
export type MunicipalCaseStudy = MunicipalCaseStudyProfile;

// 9. Historical Intelligence
export async function fetchHistoricalOverview(): Promise<HistoricalSystemOverview | null> {
  try {
    const res = await fetch('/api/historical/overview');
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.overview) return data.overview;
    }
  } catch (err) {
    console.warn('Historical overview API unavailable, using client fallback:', err);
  }
  const service = await getClientCpgramsService();
  return getHistoricalSystemOverview(service);
}

export async function fetchHistoricalComparisons(params?: {
  trend?: string;
  limit?: number;
}): Promise<DepartmentHistoricalProfile[]> {
  const query = new URLSearchParams();
  if (params?.trend) query.set('trend', params.trend);
  if (params?.limit) query.set('limit', String(params.limit));

  try {
    const res = await fetch(`/api/historical/trends?${query.toString()}`);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('Historical comparisons API unavailable, using client fallback:', err);
  }

  const service = await getClientCpgramsService();
  let comparisons = getAllHistoricalComparisons(service);
  if (params?.trend && params.trend !== 'ALL') {
    comparisons = comparisons.filter(c => c.trend === params.trend!.toUpperCase());
  }
  if (params?.limit) {
    comparisons = comparisons.slice(0, params.limit);
  }
  return comparisons;
}

export async function fetchHistoricalDepartment(entity: string): Promise<DepartmentHistoricalProfile | null> {
  try {
    const res = await fetch(`/api/historical/departments/${encodeURIComponent(entity)}`);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.profile) return data.profile;
    }
  } catch (err) {
    console.warn('Historical department API unavailable, using client fallback:', err);
  }
  const service = await getClientCpgramsService();
  return getDepartmentHistoricalComparison(entity, service);
}

// 10. Municipal Case Study (PCMC)
export async function fetchMunicipalCaseStudy(): Promise<MunicipalCaseStudy | null> {
  try {
    const res = await fetch('/api/municipal/pcmc');
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.caseStudy) return data.caseStudy;
    }
  } catch (err) {
    console.warn('Municipal case study API unavailable, using client fallback:', err);
  }
  return getMunicipalCaseStudy();
}
