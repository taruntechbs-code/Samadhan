/**
 * SAMADHAN — Actionable Intelligence Engine Types
 * Strongly typed contracts for operational risk, insights, evidence traceability, and prototype routing.
 */

export interface EvidenceReference {
  dataset: string;
  entity: string;
  metric: string;
  value: number | string;
  period: string;
  sourceUrl: string;
  sourceNote: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  metric: string;
  observed: number | string;
  threshold: number | string;
  points: number;
  explanation: string;
  evidence: EvidenceReference;
}

export interface DepartmentRisk {
  entity: string;
  scope: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 deterministic score
  reasons: string[];
  factors: RiskFactor[];
  evidence: EvidenceReference[];
}

export interface AttentionRecommendation {
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  action: string;
  rationale: string;
  triggerCondition: string;
  targetMetric: string;
  evidence?: EvidenceReference;
}

export interface DepartmentInsight {
  entity: string;
  scope: string;
  risk: DepartmentRisk;
  performanceSummary: string;
  agingInterpretation: string;
  trendInterpretation: string;
  recommendations: AttentionRecommendation[];
  evidence: EvidenceReference[];
}

export interface SystemInsight {
  title: string;
  summary: string;
  keyFindings: string[];
  topPerformingEntities: Array<{
    entity: string;
    scope: string;
    disposalRate: number;
    volume: number;
  }>;
  attentionSummary: {
    criticalCount: number;
    warningCount: number;
    totalEntitiesEvaluated: number;
    keyOperationalConcerns: string[];
  };
  agingConcentration: {
    primaryBucket: string;
    percentageOfTotal: number;
    totalPending: number;
    interpretation: string;
  };
  appealPerformanceSummary?: {
    totalAppealsReceived: number;
    totalAppealsDisposed: number;
    overallDisposalRate: number;
    pendingAppeals: number;
    keyInsight: string;
  };
  evidence: EvidenceReference[];
}

export interface TrendInsight {
  entity?: string;
  dataset: string;
  direction: 'IMPROVING' | 'DECLINING' | 'STABLE' | 'INSUFFICIENT_DATA';
  summary: string;
  rateChangePercentage?: number;
  pointsCount: number;
  evidence: EvidenceReference[];
}

export interface CandidateEntityMatch {
  entity: string;
  scope?: string;
  confidence: number; // 0.0 to 1.0
  reason: string;
}

export type RoutingStatus = 'MATCHED' | 'NEEDS_REVIEW' | 'UNCATEGORIZED';
export type RoutingOutcomeKind = 'ROUTED' | 'NEEDS_INFORMATION' | 'ERROR';

export interface ClarificationOption {
  label: string;
  querySuffix: string;
}

export interface RoutingClarification {
  question: string;
  reason: string;
  type: 'LOCATION' | 'SERVICE_DOMAIN' | 'DOCUMENT_TYPE';
  options?: ClarificationOption[];
  suggestedLocations?: string[];
}

export interface DocumentEvidenceItem {
  documentId: string;
  documentName: string;
  isRelevant: boolean;
  detectedDomain: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedSnippet?: string;
  referenceNumbers?: string[];
  dates?: string[];
}

export interface DocumentEvidenceSummary {
  totalAnalyzed: number;
  relevantCount: number;
  hasConvergence: boolean;
  hasContradiction: boolean;
  convergenceExplanation: string;
  documents: DocumentEvidenceItem[];
  strengthenedCategory?: string;
}

import { NodalGrievanceOfficer } from '../data/cpgramsNodalOfficers';

export interface RoutingRecommendation {
  outcomeKind: RoutingOutcomeKind;
  queryText: string;
  status: RoutingStatus;
  detectedCategory: string;
  recommendedEntity: string | null;
  confidence: number; // 0.0 to 1.0
  matchReason: string;
  missingInfoGuidance?: string;
  alternativeCandidates: CandidateEntityMatch[];
  disclaimer: string;
  facilityContextAvailable?: boolean;
  facilityDomain?: 'HEALTHCARE' | 'GENERAL';
  extractedFacilityQuery?: string;
  documentEvidence?: DocumentEvidenceSummary;
  jurisdictionLevel?: 'CENTRAL_MINISTRY' | 'STATE_GOVERNMENT' | 'LOCAL_MUNICIPAL' | 'GENERAL';
  explanations?: string[];
  needsLocation?: boolean;
  suggestedLocations?: string[];
  clarification?: RoutingClarification;
  nodalOfficer?: NodalGrievanceOfficer | null;
}

export interface SystemMetadata {
  version: string;
  name: string;
  description: string;
  event: string;
  totalRowsParsed: number;
  reportingEntitiesCount: number;
  availableDatasets: string[];
  availableMetrics: string[];
  livePeriod: string;
  intelligenceEngineVersion: string;
  methodology: {
    riskScoring: string;
    routingModel: string;
    datasetIntegrity: string;
  };
}
