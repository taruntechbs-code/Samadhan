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

export interface DepartmentRisk {
  entity: string;
  scope: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 deterministic score
  reasons: string[];
  evidence: EvidenceReference[];
}

export interface AttentionRecommendation {
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  action: string;
  rationale: string;
  triggerCondition: string;
  targetMetric: string;
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

export interface RoutingRecommendation {
  queryText: string;
  detectedCategory: string;
  recommendedEntity: string | null;
  confidence: number; // 0.0 to 1.0
  matchReason: string;
  alternativeCandidates: CandidateEntityMatch[];
  disclaimer: string;
}
