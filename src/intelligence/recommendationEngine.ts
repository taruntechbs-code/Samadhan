/**
 * SAMADHAN — Actionable Recommendation Engine
 * Transforms analytical findings into neutral, operational, and prioritized recommendations.
 */

import { PeriodDepartmentMetrics } from '../data/types';
import { AttentionRecommendation } from './types';

/**
 * Generates prioritized operational recommendations for a department based on real metrics.
 */
export function generateDepartmentRecommendations(
  metric: PeriodDepartmentMetrics
): AttentionRecommendation[] {
  const recommendations: AttentionRecommendation[] = [];

  // 1. Grievances > 1 Year
  if (metric.pending_more_than_1_year > 0) {
    recommendations.push({
      priority: 'URGENT',
      action: 'Initiate priority review drive for cases exceeding 1 year of pendency.',
      rationale: `${metric.pending_more_than_1_year} cases have exceeded 365 days. Expedited review prevents chronic unresolved backlog.`,
      triggerCondition: 'pending_more_than_1_year > 0',
      targetMetric: 'pending_more_than_1_year',
    });
  }

  // 2. Critical Disposal Rate (< 70%)
  if (metric.effectiveDisposalRate < 70) {
    recommendations.push({
      priority: 'URGENT',
      action: 'Conduct operational workflow review to eliminate resolution bottlenecks.',
      rationale: `Current disposal rate of ${metric.effectiveDisposalRate}% is significantly below the minimum operational standard (70%).`,
      triggerCondition: 'disposal_rate < 70%',
      targetMetric: 'percent_disposed',
    });
  } else if (metric.effectiveDisposalRate < 80) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Review pending case assignments and nodal officer workload distribution.',
      rationale: `Disposal rate of ${metric.effectiveDisposalRate}% is below target benchmark (80%).`,
      triggerCondition: 'disposal_rate < 80%',
      targetMetric: 'percent_disposed',
    });
  }

  // 3. Approaching 1 Year (180-365 days)
  if (metric.pending_180_365_days > 20) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Prioritize aging queue in the 180–365 day window before cases cross the 1-year mark.',
      rationale: `${metric.pending_180_365_days} grievances are approaching one year in pending status.`,
      triggerCondition: 'pending_180_365_days > 20',
      targetMetric: 'pending_180_365_days',
    });
  }

  // 4. Moderate Aging Window (60-180 days)
  if (metric.pending_60_180_days > 500) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Expedite inter-departmental responses for cases pending between 60 and 180 days.',
      rationale: `${metric.pending_60_180_days.toLocaleString('en-IN')} cases are currently awaiting field resolution.`,
      triggerCondition: 'pending_60_180_days > 500',
      targetMetric: 'pending_60_180_days',
    });
  }

  // 5. Healthy Trajectory
  if (metric.effectiveDisposalRate >= 90 && metric.pending_more_than_1_year === 0) {
    recommendations.push({
      priority: 'ROUTINE',
      action: 'Maintain current disposal procedures and document effective redressal workflows.',
      rationale: `Performance is strong with a ${metric.effectiveDisposalRate}% disposal rate and zero >1-year pendency.`,
      triggerCondition: 'disposal_rate >= 90% && pending_more_than_1_year == 0',
      targetMetric: 'percent_disposed',
    });
  }

  return recommendations;
}
