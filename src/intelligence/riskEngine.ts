/**
 * SAMADHAN — Operational Risk Engine
 * Deterministic, explainable operational risk calculation based on verified CPGRAMS metrics.
 */

import { PeriodDepartmentMetrics } from '../data/types';
import { DepartmentRisk, EvidenceReference, RiskFactor, RiskLevel } from './types';

/**
 * Computes deterministic operational risk for a department metric record.
 */
export function calculateDepartmentRisk(
  metric: PeriodDepartmentMetrics,
  sourceUrl: string = 'https://pgportal.gov.in/darpgdashboard',
  sourceNote: string = 'Official CPGRAMS verified metrics dataset.',
  historicalBaselineRate?: number
): DepartmentRisk {
  const reasons: string[] = [];
  const factors: RiskFactor[] = [];
  const evidence: EvidenceReference[] = [];
  let score = 0;

  const periodStr = metric.periodStart && metric.periodEnd
    ? `${metric.periodStart} to ${metric.periodEnd}`
    : metric.periodKey;

  // 1. Disposal Rate Evaluation
  const rate = metric.effectiveDisposalRate;
  const rateEvidence: EvidenceReference = {
    dataset: metric.dataset,
    entity: metric.entity,
    metric: 'effectiveDisposalRate',
    value: rate,
    period: periodStr,
    sourceUrl,
    sourceNote,
  };
  evidence.push(rateEvidence);

  if (rate < 50) {
    const points = 45;
    score += points;
    const explanation = `Disposal velocity (${rate}%) is critically below the 50% minimum threshold.`;
    reasons.push(explanation);
    factors.push({
      metric: 'disposalRate',
      observed: rate,
      threshold: 50,
      points,
      explanation,
      evidence: rateEvidence,
    });
  } else if (rate < 70) {
    const points = 35;
    score += points;
    const explanation = `Disposal rate of ${rate}% is below the 70% operational standard.`;
    reasons.push(explanation);
    factors.push({
      metric: 'disposalRate',
      observed: rate,
      threshold: 70,
      points,
      explanation,
      evidence: rateEvidence,
    });
  } else if (rate < 80) {
    const points = 25;
    score += points;
    const explanation = `Disposal rate of ${rate}% is below target operational threshold of 80%.`;
    reasons.push(explanation);
    factors.push({
      metric: 'disposalRate',
      observed: rate,
      threshold: 80,
      points,
      explanation,
      evidence: rateEvidence,
    });
  } else if (rate < 90) {
    const points = 15;
    score += points;
    const explanation = `Disposal rate of ${rate}% is below excellence benchmark of 90%.`;
    reasons.push(explanation);
    factors.push({
      metric: 'disposalRate',
      observed: rate,
      threshold: 90,
      points,
      explanation,
      evidence: rateEvidence,
    });
  }

  // 2. >1 Year Pendency Evaluation
  if (metric.pending_more_than_1_year > 0) {
    const points = metric.pending_more_than_1_year > 10 ? 35 : 25;
    score += points;
    const explanation = `${metric.pending_more_than_1_year} grievances have exceeded 1 year of pendency.`;
    reasons.push(explanation);

    const yrEvidence: EvidenceReference = {
      dataset: metric.dataset,
      entity: metric.entity,
      metric: 'pending_more_than_1_year',
      value: metric.pending_more_than_1_year,
      period: periodStr,
      sourceUrl,
      sourceNote,
    };
    evidence.push(yrEvidence);

    factors.push({
      metric: 'pending_more_than_1_year',
      observed: metric.pending_more_than_1_year,
      threshold: 0,
      points,
      explanation,
      evidence: yrEvidence,
    });
  }

  // 3. 180-365 Day Aging Evaluation
  if (metric.pending_180_365_days > 0) {
    const yrMidEvidence: EvidenceReference = {
      dataset: metric.dataset,
      entity: metric.entity,
      metric: 'pending_180_365_days',
      value: metric.pending_180_365_days,
      period: periodStr,
      sourceUrl,
      sourceNote,
    };
    evidence.push(yrMidEvidence);

    if (metric.pending_180_365_days > 100) {
      const points = 20;
      score += points;
      const explanation = `High volume of aging grievances in 180–365 day queue (${metric.pending_180_365_days} cases).`;
      reasons.push(explanation);
      factors.push({
        metric: 'pending_180_365_days',
        observed: metric.pending_180_365_days,
        threshold: 100,
        points,
        explanation,
        evidence: yrMidEvidence,
      });
    } else if (metric.pending_180_365_days > 20) {
      const points = 10;
      score += points;
      const explanation = `${metric.pending_180_365_days} grievances in 180–365 day queue approaching 1-year mark.`;
      reasons.push(explanation);
      factors.push({
        metric: 'pending_180_365_days',
        observed: metric.pending_180_365_days,
        threshold: 20,
        points,
        explanation,
        evidence: yrMidEvidence,
      });
    }
  }

  // 4. High Total Pendency Volume Strain
  if (metric.totalPending > 5000 && rate < 85) {
    const points = 10;
    score += points;
    const explanation = `High active backlog (${metric.totalPending.toLocaleString('en-IN')} cases) coupled with <85% disposal rate.`;
    reasons.push(explanation);

    const pendEvidence: EvidenceReference = {
      dataset: metric.dataset,
      entity: metric.entity,
      metric: 'totalPending',
      value: metric.totalPending,
      period: periodStr,
      sourceUrl,
      sourceNote,
    };
    evidence.push(pendEvidence);

    factors.push({
      metric: 'totalPending',
      observed: metric.totalPending,
      threshold: 5000,
      points,
      explanation,
      evidence: pendEvidence,
    });
  }

  // 5. Optional Historical Deterioration Factor
  if (historicalBaselineRate !== undefined && historicalBaselineRate > 0) {
    const variance = Number((rate - historicalBaselineRate).toFixed(2));
    if (variance <= -5.0) {
      const points = variance <= -10.0 ? 15 : 10;
      score += points;
      const explanation = `Disposal velocity (${rate}%) exhibits material historical deterioration compared to 10-year baseline (${historicalBaselineRate}% by ${variance} pp).`;
      reasons.push(explanation);

      const histEvidence: EvidenceReference = {
        dataset: 'department_history_2016_2026-02-28',
        entity: metric.entity,
        metric: 'historical_disposal_baseline',
        value: `${historicalBaselineRate}% baseline`,
        period: '2016-01-01 to 2026-02-28',
        sourceUrl: 'https://www.data.gov.in/resource/department-wise-receipts-disposal-and-pendency-public-grievance-detailed-statistics',
        sourceNote: 'DARPG 10-year longitudinal historical baseline.',
      };
      evidence.push(histEvidence);

      factors.push({
        metric: 'historicalDeterioration',
        observed: rate,
        threshold: historicalBaselineRate,
        points,
        explanation,
        evidence: histEvidence,
      });
    }
  }

  // Determine Final Deterministic Risk Tier
  let riskLevel: RiskLevel = 'LOW';
  if (score >= 45 || metric.pending_more_than_1_year > 0 || rate < 70) {
    riskLevel = 'CRITICAL';
  } else if (score >= 25 || rate < 80 || metric.pending_180_365_days > 50) {
    riskLevel = 'HIGH';
  } else if (score >= 15 || rate < 90) {
    riskLevel = 'MEDIUM';
  }

  if (reasons.length === 0) {
    reasons.push(`Disposal performance (${rate}%) is healthy and pendency is within normal aging thresholds.`);
  }

  return {
    entity: metric.entity,
    scope: metric.scope,
    riskLevel,
    riskScore: Math.min(score, 100),
    reasons,
    factors,
    evidence,
  };
}
