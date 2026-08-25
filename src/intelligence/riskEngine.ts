/**
 * SAMADHAN — Operational Risk Engine
 * Deterministic, explainable operational risk calculation based on verified CPGRAMS metrics.
 */

import { PeriodDepartmentMetrics } from '../data/types';
import { DepartmentRisk, EvidenceReference, RiskLevel } from './types';

/**
 * Computes deterministic operational risk for a department metric record.
 */
export function calculateDepartmentRisk(
  metric: PeriodDepartmentMetrics,
  sourceUrl: string = 'https://pgportal.gov.in/darpgdashboard',
  sourceNote: string = 'Official CPGRAMS verified metrics dataset.'
): DepartmentRisk {
  const reasons: string[] = [];
  const evidence: EvidenceReference[] = [];
  let score = 0;

  const periodStr = metric.periodStart && metric.periodEnd
    ? `${metric.periodStart} to ${metric.periodEnd}`
    : metric.periodKey;

  // 1. Disposal Rate Evaluation
  const rate = metric.effectiveDisposalRate;
  if (rate < 50) {
    score += 45;
    reasons.push(`Disposal rate of ${rate}% is below critical operational threshold (50%)`);
  } else if (rate < 70) {
    score += 35;
    reasons.push(`Disposal rate of ${rate}% is below the 70% operational benchmark`);
  } else if (rate < 80) {
    score += 25;
    reasons.push(`Disposal rate of ${rate}% is below target threshold of 80%`);
  } else if (rate < 90) {
    score += 15;
    reasons.push(`Disposal rate of ${rate}% is below excellence benchmark of 90%`);
  }

  evidence.push({
    dataset: metric.dataset,
    entity: metric.entity,
    metric: 'effectiveDisposalRate',
    value: rate,
    period: periodStr,
    sourceUrl,
    sourceNote,
  });

  // 2. >1 Year Pendency Evaluation
  if (metric.pending_more_than_1_year > 0) {
    if (metric.pending_more_than_1_year > 10) {
      score += 35;
    } else {
      score += 25;
    }
    reasons.push(
      `${metric.pending_more_than_1_year} grievances have exceeded 1 year of pendency`
    );

    evidence.push({
      dataset: metric.dataset,
      entity: metric.entity,
      metric: 'pending_more_than_1_year',
      value: metric.pending_more_than_1_year,
      period: periodStr,
      sourceUrl,
      sourceNote,
    });
  }

  // 3. 180-365 Day Aging Evaluation
  if (metric.pending_180_365_days > 0) {
    if (metric.pending_180_365_days > 100) {
      score += 20;
      reasons.push(
        `High volume of grievances in the 180-365 day aging window (${metric.pending_180_365_days} cases)`
      );
    } else if (metric.pending_180_365_days > 20) {
      score += 10;
      reasons.push(
        `${metric.pending_180_365_days} grievances in the 180-365 day aging window approaching 1 year`
      );
    }

    evidence.push({
      dataset: metric.dataset,
      entity: metric.entity,
      metric: 'pending_180_365_days',
      value: metric.pending_180_365_days,
      period: periodStr,
      sourceUrl,
      sourceNote,
    });
  }

  // 4. High Total Pendency Volume
  if (metric.totalPending > 5000 && rate < 85) {
    score += 10;
    reasons.push(
      `High volume of unresolved pendency (${metric.totalPending.toLocaleString('en-IN')} cases) coupled with <85% disposal rate`
    );
  }

  evidence.push({
    dataset: metric.dataset,
    entity: metric.entity,
    metric: 'totalPending',
    value: metric.totalPending,
    period: periodStr,
    sourceUrl,
    sourceNote,
  });

  // Determine Final Risk Level
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
    evidence,
  };
}
