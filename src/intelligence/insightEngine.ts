/**
 * SAMADHAN — Insight Engine
 * Generates evidence-backed, factual, and actionable insights for system and department level views.
 */

import { CpgramsService } from '../services/cpgramsService';
import { calculateDepartmentRisk } from './riskEngine';
import { generateDepartmentRecommendations } from './recommendationEngine';
import {
  DepartmentInsight,
  SystemInsight,
  EvidenceReference,
} from './types';

/**
 * Generates comprehensive, high-value system-level intelligence insights.
 */
export function getSystemInsights(service: CpgramsService): SystemInsight {
  const overview = service.getSystemOverview('live_dashboard_2026');
  const appeals = service.getAppealsOverview();
  const topPerformers = service.getDepartmentRanking('disposalRate', 'desc').slice(0, 5);

  const evidence: EvidenceReference[] = [
    {
      dataset: overview.dataset,
      entity: 'System-Wide Aggregation',
      metric: 'received',
      value: overview.received,
      period: `${overview.periodStart} to ${overview.periodEnd}`,
      sourceUrl: overview.source.sourceUrl,
      sourceNote: overview.source.sourceNote,
    },
    {
      dataset: overview.dataset,
      entity: 'System-Wide Aggregation',
      metric: 'disposed',
      value: overview.disposed,
      period: `${overview.periodStart} to ${overview.periodEnd}`,
      sourceUrl: overview.source.sourceUrl,
      sourceNote: overview.source.sourceNote,
    },
    {
      dataset: overview.dataset,
      entity: 'System-Wide Aggregation',
      metric: 'disposalRate',
      value: overview.disposalRate,
      period: `${overview.periodStart} to ${overview.periodEnd}`,
      sourceUrl: overview.source.sourceUrl,
      sourceNote: overview.source.sourceNote,
    },
  ];

  // Aging concentration calculations
  const totalPending = overview.pending;
  const p0_60 = overview.agingBuckets['0_60_days'];
  const pctFresh = totalPending > 0 ? Number(((p0_60 / totalPending) * 100).toFixed(1)) : 0;

  const keyFindings: string[] = [
    `Across ${overview.entities} tracked entities, ${overview.disposed.toLocaleString('en-IN')} out of ${overview.received.toLocaleString('en-IN')} received grievances have been disposed, achieving an overall disposal rate of ${overview.disposalRate}%.`,
    `${pctFresh}% of total unresolved grievances (${p0_60.toLocaleString('en-IN')} cases) are within the primary 0–60 day resolution window.`,
    `${overview.criticalEntitiesCount} entities are currently categorized as requiring CRITICAL operational attention due to disposal rates trailing 80%.`,
  ];

  const concerns: string[] = [];
  if (overview.criticalEntitiesCount > 0) {
    concerns.push(`${overview.criticalEntitiesCount} entities operating below the 80% disposal threshold.`);
  }
  if (overview.agingBuckets['180_365_days'] > 0) {
    concerns.push(`${overview.agingBuckets['180_365_days'].toLocaleString('en-IN')} grievances across the system are pending between 180 and 365 days.`);
  }

  return {
    title: 'CPGRAMS System Operational Intelligence Summary',
    summary: `Active monitoring across ${overview.entities} public entities handling ${overview.received.toLocaleString('en-IN')} received grievances reflects healthy overall disposal velocity (${overview.disposalRate}%), with pending volume concentrated predominantly in the initial 60-day window.`,
    keyFindings,
    topPerformingEntities: topPerformers.map(t => ({
      entity: t.entity,
      scope: t.scope,
      disposalRate: t.effectiveDisposalRate,
      volume: t.received,
    })),
    attentionSummary: {
      criticalCount: overview.criticalEntitiesCount,
      warningCount: overview.warningEntitiesCount,
      totalEntitiesEvaluated: overview.entities,
      keyOperationalConcerns: concerns,
    },
    agingConcentration: {
      primaryBucket: '0_60_days',
      percentageOfTotal: pctFresh,
      totalPending,
      interpretation: `${pctFresh}% of all active pendency is under 60 days old, indicating standard throughput with minimal chronic aging.`,
    },
    appealPerformanceSummary: {
      totalAppealsReceived: appeals.appealsReceived,
      totalAppealsDisposed: appeals.appealsDisposed,
      overallDisposalRate: appeals.appealDisposalRate,
      pendingAppeals: appeals.appealsPending,
      keyInsight: `Appellate redressal shows a ${appeals.appealDisposalRate}% disposal rate across ${appeals.departmentCount} departments, handling ${appeals.appealsReceived.toLocaleString('en-IN')} filed appeals.`,
    },
    evidence,
  };
}

/**
 * Generates detailed, explainable intelligence for a specific department.
 */
export function getDepartmentInsights(
  entityName: string,
  service: CpgramsService
): DepartmentInsight | null {
  const detail = service.getDepartmentByName(entityName);
  if (!detail) return null;

  // Retrieve matching live period metric for risk evaluation
  const liveMetrics = service.getDepartmentRanking('received', 'desc').find(
    m => m.entity.toLowerCase() === detail.entity.toLowerCase()
  );

  const targetMetric = liveMetrics || {
    entity: detail.entity,
    scope: detail.scope,
    dataset: detail.currentPeriod.dataset,
    periodStart: detail.currentPeriod.periodStart,
    periodEnd: detail.currentPeriod.periodEnd,
    periodKey: `${detail.currentPeriod.periodStart}_${detail.currentPeriod.periodEnd}`,
    received: detail.currentPeriod.received,
    disposed: detail.currentPeriod.disposed,
    sourcePercentDisposed: detail.currentPeriod.disposalRate,
    calculatedDisposalRate: detail.currentPeriod.disposalRate,
    effectiveDisposalRate: detail.currentPeriod.disposalRate,
    pending_0_60_days: detail.currentPeriod.agingBuckets['0_60_days'],
    pending_60_180_days: detail.currentPeriod.agingBuckets['60_180_days'],
    pending_180_365_days: detail.currentPeriod.agingBuckets['180_365_days'],
    pending_more_than_1_year: detail.currentPeriod.pendingOverOneYear,
    totalPending: detail.currentPeriod.totalPending,
    rawMetrics: {},
  };

  const risk = calculateDepartmentRisk(targetMetric, detail.source.sourceUrl, detail.source.sourceNote);
  const recommendations = generateDepartmentRecommendations(targetMetric);

  // Performance summary calculation
  const perfSummary = `${detail.entity} has received ${detail.currentPeriod.received.toLocaleString('en-IN')} grievances and disposed ${detail.currentPeriod.disposed.toLocaleString('en-IN')}, recording an effective disposal rate of ${detail.currentPeriod.disposalRate}%. Total unresolved pendency stands at ${detail.currentPeriod.totalPending.toLocaleString('en-IN')} cases.`;

  // Aging interpretation
  const totalP = detail.currentPeriod.totalPending;
  const p0_60 = detail.currentPeriod.agingBuckets['0_60_days'];
  const pctFresh = totalP > 0 ? ((p0_60 / totalP) * 100).toFixed(1) : '100';
  let agingInterpretation = `${pctFresh}% of pending cases (${p0_60.toLocaleString('en-IN')}) are in the 0–60 day window.`;
  if (detail.currentPeriod.pendingOverOneYear > 0) {
    agingInterpretation += ` Critical attention required: ${detail.currentPeriod.pendingOverOneYear} cases exceed 1 year of pendency.`;
  } else {
    agingInterpretation += ` Zero cases exceed 1 year of pendency.`;
  }

  // Trend interpretation
  let trendInterpretation = 'Single live reporting period active.';
  if (detail.historicalPerformance.length > 1) {
    trendInterpretation = `Tracked across ${detail.historicalPerformance.length} historical dataset series, reflecting longitudinal resolution tracking.`;
  }

  return {
    entity: detail.entity,
    scope: detail.scope,
    risk,
    performanceSummary: perfSummary,
    agingInterpretation,
    trendInterpretation,
    recommendations,
    evidence: risk.evidence,
  };
}
