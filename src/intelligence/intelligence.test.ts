/**
 * SAMADHAN — Actionable Intelligence Engine Unit Tests
 * Validates Risk Engine, Insight Generation, Recommendations, Evidence, and Prototype Routing.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseCpgramsCsv } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from '../services/cpgramsService';
import {
  calculateDepartmentRisk,
  generateDepartmentRecommendations,
  getSystemInsights,
  getDepartmentInsights,
  routeGrievanceText,
} from './index';

describe('Actionable Intelligence Engine', () => {
  let service: CpgramsService;

  beforeAll(() => {
    const csvPath = path.resolve(process.cwd(), '10_MASTER_verified_cpgrams_metrics_long.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const parseResult = parseCpgramsCsv(csvContent);
    service = initializeCpgramsService(parseResult.normalizedRows);
  });

  // 1. Risk Engine
  describe('Risk Engine (calculateDepartmentRisk)', () => {
    it('should assign CRITICAL risk with explainable reasons to low disposal rate entities', () => {
      const lowDisposalMetric = service.getDepartmentRanking('disposalRate', 'asc')[0]; // Manipur (2.51%)
      const risk = calculateDepartmentRisk(lowDisposalMetric);

      expect(risk.riskLevel).toBe('CRITICAL');
      expect(risk.riskScore).toBeGreaterThanOrEqual(45);
      expect(risk.reasons.length).toBeGreaterThan(0);
      expect(risk.reasons[0]).toContain('below critical operational threshold');
      expect(risk.evidence.length).toBeGreaterThan(0);

      // Verify evidence structure
      const rateEvidence = risk.evidence.find(e => e.metric === 'effectiveDisposalRate');
      expect(rateEvidence).toBeDefined();
      expect(rateEvidence!.dataset).toBe('live_dashboard_2026');
      expect(rateEvidence!.sourceUrl).toBeTruthy();
    });

    it('should assign LOW risk to high-performing departments', () => {
      const topMetric = service.getDepartmentRanking('disposalRate', 'desc')[0]; // Official Language (100%)
      const risk = calculateDepartmentRisk(topMetric);

      expect(risk.riskLevel).toBe('LOW');
      expect(risk.riskScore).toBeLessThan(15);
      expect(risk.reasons[0]).toContain('healthy');
    });

    it('should flag >1-year pendency as high/critical risk if present', () => {
      const syntheticRecord = {
        entity: 'Sample Test Department',
        scope: 'Department',
        dataset: 'live_dashboard_2026',
        periodStart: '2026-01-01',
        periodEnd: '2026-08-24',
        periodKey: '2026-01-01_2026-08-24',
        received: 1000,
        disposed: 950,
        sourcePercentDisposed: 95,
        calculatedDisposalRate: 95,
        effectiveDisposalRate: 95,
        pending_0_60_days: 35,
        pending_60_180_days: 0,
        pending_180_365_days: 0,
        pending_more_than_1_year: 15,
        totalPending: 50,
        rawMetrics: {},
      };

      const risk = calculateDepartmentRisk(syntheticRecord);
      expect(risk.riskLevel).toBe('CRITICAL');
      expect(risk.reasons.some(r => r.includes('exceeded 1 year'))).toBe(true);
    });
  });

  // 2. Action Recommendations
  describe('Recommendation Engine (generateDepartmentRecommendations)', () => {
    it('should recommend workflow review for low disposal performance', () => {
      const lowDept = service.getDepartmentRanking('disposalRate', 'asc')[0];
      const recs = generateDepartmentRecommendations(lowDept);

      expect(recs.length).toBeGreaterThan(0);
      const urgentRec = recs.find(r => r.priority === 'URGENT');
      expect(urgentRec).toBeDefined();
      expect(urgentRec!.action).toContain('workflow review');
      expect(urgentRec!.targetMetric).toBe('percent_disposed');
    });

    it('should recommend best-practice maintenance for top-performing departments', () => {
      const topDept = service.getDepartmentByName('Labour and Employment')!;
      const liveMetric = service.getDepartmentRanking('received', 'desc').find(m => m.entity === topDept.entity)!;
      const recs = generateDepartmentRecommendations(liveMetric);

      expect(recs.length).toBeGreaterThan(0);
      const routineRec = recs.find(r => r.priority === 'ROUTINE');
      expect(routineRec).toBeDefined();
      expect(routineRec!.action).toContain('Maintain current disposal');
    });
  });

  // 3. System-Level Insights
  describe('System Insights (getSystemInsights)', () => {
    it('should generate executive findings and aging concentration', () => {
      const insights = getSystemInsights(service);

      expect(insights.title).toContain('CPGRAMS');
      expect(insights.summary).toMatch(/21,77,902|2,177,902/);
      expect(insights.keyFindings.length).toBeGreaterThanOrEqual(3);
      expect(insights.agingConcentration.primaryBucket).toBe('0_60_days');
      expect(insights.agingConcentration.percentageOfTotal).toBe(71.4); // (196528 / 275212) * 100
      expect(insights.appealPerformanceSummary).toBeDefined();
      expect(insights.evidence.length).toBeGreaterThan(0);
    });
  });

  // 4. Department Insights
  describe('Department Insights (getDepartmentInsights)', () => {
    it('should generate comprehensive explainable insight for known department', () => {
      const insight = getDepartmentInsights('Labour and Employment', service);

      expect(insight).not.toBeNull();
      expect(insight!.entity).toBe('Labour and Employment');
      expect(insight!.risk).toBeDefined();
      expect(insight!.performanceSummary).toContain('2,25,395');
      expect(insight!.performanceSummary).toContain('92.81%');
      expect(insight!.agingInterpretation).toContain('0–60 day window');
      expect(insight!.recommendations.length).toBeGreaterThan(0);
      expect(insight!.evidence.length).toBeGreaterThan(0);
    });

    it('should return null for non-existent department', () => {
      const insight = getDepartmentInsights('Unknown Entity 999', service);
      expect(insight).toBeNull();
    });
  });

  // 5. Citizen Routing Engine
  describe('Citizen Routing Engine (routeGrievanceText)', () => {
    it('should route tax problems to CBDT (Income Tax)', () => {
      const result = routeGrievanceText('My ITR income tax refund is pending for 6 months');

      expect(result.detectedCategory).toBe('Income Tax & Direct Taxation');
      expect(result.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.matchReason).toContain('keywords');
      expect(result.disclaimer).toContain('Prototype routing');
      expect(result.alternativeCandidates.length).toBeGreaterThan(0);
    });

    it('should route banking/ATM complaints to Financial Services (Banking Division)', () => {
      const result = routeGrievanceText('Money debited from ATM but cash not dispensed, UPI payment failed');

      expect(result.detectedCategory).toBe('Banking & Financial Services');
      expect(result.recommendedEntity).toBe('Financial Services (Banking Division)');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should route railway grievances to Railway Board', () => {
      const result = routeGrievanceText('IRCTC train tatkal ticket cancelled but refund not credited');

      expect(result.detectedCategory).toBe('Railways & Train Services');
      expect(result.recommendedEntity).toBe('Railway Board');
    });

    it('should route passport problems to External Affairs', () => {
      const result = routeGrievanceText('Passport renewal application delayed at seva kendra');

      expect(result.detectedCategory).toBe('External Affairs, Passport & Visa');
      expect(result.recommendedEntity).toBe('External Affairs');
    });

    it('should handle unclassifiable problem with confidence 0 and null entity', () => {
      const result = routeGrievanceText('The quantum mechanics equation has an anomalous gravitational ripple');

      expect(result.recommendedEntity).toBeNull();
      expect(result.confidence).toBe(0);
      expect(result.detectedCategory).toContain('Uncategorized');
    });

    it('should handle empty input safely', () => {
      const result = routeGrievanceText('   ');
      expect(result.recommendedEntity).toBeNull();
      expect(result.confidence).toBe(0);
    });
  });
});
