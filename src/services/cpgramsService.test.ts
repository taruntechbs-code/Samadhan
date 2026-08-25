/**
 * SAMADHAN — Phase 2 Backend Intelligence Service Layer Unit Tests
 * Uses real parsed CSV dataset to validate all service layer functions.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseCpgramsCsv } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from './cpgramsService';

describe('CpgramsService (Intelligence Layer)', () => {
  let service: CpgramsService;

  beforeAll(() => {
    const csvPath = path.resolve(process.cwd(), '10_MASTER_verified_cpgrams_metrics_long.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const parseResult = parseCpgramsCsv(csvContent);
    expect(parseResult.validRowCount).toBe(2134);
    service = initializeCpgramsService(parseResult.normalizedRows);
  });

  // 1. System Overview & Double Counting Prevention
  describe('getSystemOverview', () => {
    it('should aggregate the live 2026 dataset without mixing historical datasets', () => {
      const overview = service.getSystemOverview('live_dashboard_2026');

      expect(overview.dataset).toBe('live_dashboard_2026');
      expect(overview.periodStart).toBe('2026-01-01');
      expect(overview.periodEnd).toBe('2026-08-24');
      expect(overview.entities).toBe(127);
      expect(overview.received).toBe(2177902);
      expect(overview.disposed).toBe(1902690);
      expect(overview.disposalRate).toBe(87.36);
      expect(overview.pending).toBe(275212);
      expect(overview.source.sourceUrl).toContain('darpgdashboard');
    });

    it('should calculate accurate 4-bucket aging breakdown for system', () => {
      const overview = service.getSystemOverview('live_dashboard_2026');
      const aging = overview.agingBuckets;

      expect(aging['0_60_days']).toBe(196528);
      expect(aging['60_180_days']).toBe(67094);
      expect(aging['180_365_days']).toBe(11590);
      expect(aging['over_1_year']).toBe(0);
      expect(aging.total).toBe(196528 + 67094 + 11590 + 0);
      expect(aging.total).toBe(overview.pending);
    });

    it('should apply scope filtering to system overview', () => {
      const deptOverview = service.getSystemOverview('live_dashboard_2026', { scope: 'Department' });
      const stateOverview = service.getSystemOverview('live_dashboard_2026', { scope: 'State/UT' });

      expect(deptOverview.entities + stateOverview.entities).toBe(127);
      expect(deptOverview.received + stateOverview.received).toBe(2177902);
    });
  });

  // 2. Department Detail & Unknown Handling
  describe('getDepartmentByName', () => {
    it('should retrieve comprehensive detail for known department with live metrics, appeals and history', () => {
      const dept = service.getDepartmentByName('Labour and Employment');

      expect(dept).not.toBeNull();
      expect(dept!.entity).toBe('Labour and Employment');
      expect(dept!.scope).toBe('Department');
      expect(dept!.currentPeriod.received).toBe(225395);
      expect(dept!.currentPeriod.disposed).toBe(209186);
      expect(dept!.currentPeriod.disposalRate).toBe(92.81);
      expect(dept!.currentPeriod.totalPending).toBe(16209);
      expect(dept!.currentPeriod.agingBuckets['0_60_days']).toBe(15291);
      expect(dept!.currentPeriod.agingBuckets['60_180_days']).toBe(889);
      expect(dept!.currentPeriod.agingBuckets['180_365_days']).toBe(29);
      expect(dept!.currentPeriod.agingBuckets['over_1_year']).toBe(0);
      expect(dept!.source.sourceUrl).toBeTruthy();
    });

    it('should return null for non-existent department', () => {
      const dept = service.getDepartmentByName('NonExistent Ministry of Magic');
      expect(dept).toBeNull();
    });

    it('should handle case-insensitive and whitespace trimmed lookups', () => {
      const dept = service.getDepartmentByName('  labour and employment  ');
      expect(dept).not.toBeNull();
      expect(dept!.entity).toBe('Labour and Employment');
    });

    it('should attach appeals metrics where available', () => {
      const dept = service.getDepartmentByName('Central Board of Direct Taxes (Income Tax)');
      expect(dept).not.toBeNull();
      expect(dept!.appeals).toBeDefined();
      expect(dept!.appeals!.received).toBe(5854);
      expect(dept!.appeals!.disposed).toBe(5150);
      expect(dept!.appeals!.pending).toBe(704);
      expect(dept!.appeals!.disposalRate).toBe(87.97);
    });
  });

  // 3. Department Rankings
  describe('getDepartmentRanking', () => {
    it('should rank departments correctly by volume (received descending)', () => {
      const ranking = service.getDepartmentRanking('received', 'desc');

      expect(ranking.length).toBe(127);
      expect(ranking[0].entity).toBe('Uttar Pradesh');
      expect(ranking[0].received).toBe(232563);
      expect(ranking[1].entity).toBe('Labour and Employment');
      expect(ranking[1].received).toBe(225395);
    });

    it('should rank departments correctly by disposal rate (descending and ascending)', () => {
      const topDisposal = service.getDepartmentRanking('disposalRate', 'desc');
      const lowDisposal = service.getDepartmentRanking('disposalRate', 'asc');

      expect(topDisposal[0].effectiveDisposalRate).toBeGreaterThanOrEqual(99.0);
      expect(lowDisposal[0].effectiveDisposalRate).toBeLessThan(10.0);
    });
  });

  // 4. Attention Engine & Explainable Reasons
  describe('getAttentionRequired', () => {
    it('should identify critical and warning departments with explainable reasons', () => {
      const attention = service.getAttentionRequired();

      expect(attention.length).toBeGreaterThan(0);
      const criticals = attention.filter(a => a.severity === 'CRITICAL');
      const warnings = attention.filter(a => a.severity === 'WARNING');

      expect(criticals.length).toBeGreaterThan(0);
      expect(warnings.length).toBeGreaterThan(0);

      // Verify explainable non-accusatory reason structure
      for (const item of attention) {
        expect(item.reason).toBeTruthy();
        expect(item.reason).not.toMatch(/corruption|fraud|crime|guilty/i);
        expect(item.threshold).toBeDefined();
        expect(item.value).toBeDefined();
      }
    });

    it('should respect custom attention configuration thresholds', () => {
      const strictAttention = service.getAttentionRequired({
        criticalDisposalRateThreshold: 90,
      });

      const normalAttention = service.getAttentionRequired({
        criticalDisposalRateThreshold: 50,
      });

      const strictCriticals = strictAttention.filter(a => a.severity === 'CRITICAL');
      const normalCriticals = normalAttention.filter(a => a.severity === 'CRITICAL');

      expect(strictCriticals.length).toBeGreaterThan(normalCriticals.length);
    });
  });

  // 5. Aging Analysis
  describe('getAgingAnalysis', () => {
    it('should compute department-level aging breakdown accurately', () => {
      const upAging = service.getAgingAnalysis('Uttar Pradesh');

      expect(upAging['0_60_days']).toBe(35981);
      expect(upAging['60_180_days']).toBe(1550);
      expect(upAging['180_365_days']).toBe(346);
      expect(upAging['over_1_year']).toBe(0);
      expect(upAging.total).toBe(37877);
    });
  });

  // 6. Appeals Overview
  describe('getAppealsOverview', () => {
    it('should aggregate separate appeals dataset without mixing regular grievance metrics', () => {
      const appeals = service.getAppealsOverview();

      expect(appeals.dataset).toBe('appeal_dashboard_2026-08-25');
      expect(appeals.departmentCount).toBe(88);
      expect(appeals.appealsReceived).toBe(230602);
      expect(appeals.appealsDisposed).toBe(214501);
      expect(appeals.appealsPending).toBe(16101);
      expect(appeals.appealDisposalRate).toBe(93.02);
      expect(appeals.departmentAppeals.length).toBe(88);
    });
  });

  // 7. Historical Trend Selection & Dataset Separation
  describe('getHistoricalTrends', () => {
    it('should separate datasets into distinct trend series for multi-period entities without blending', () => {
      const upTrends = service.getHistoricalTrends('Uttar Pradesh');

      expect(upTrends.length).toBeGreaterThanOrEqual(2);
      const datasetNames = upTrends.map(t => t.dataset);

      for (const t of upTrends) {
        expect(t.points.length).toBeGreaterThan(0);
        expect(t.source.dataset).toBe(t.dataset);
      }

      expect(datasetNames).toContain('live_dashboard_2026');
      expect(datasetNames).toContain('state_cpgrams_2020_2024');
    });

    it('should isolate monthly progress reports', () => {
      const monthlyTrends = service.getHistoricalTrends(undefined, 'monthly_central_2026');
      expect(monthlyTrends.length).toBe(1);
      expect(monthlyTrends[0].points.length).toBe(6); // Jan to Jun 2026
    });
  });

  // 8. Available Metadata & Metrics
  describe('Metadata Discovery', () => {
    it('should report all 31 distinct metrics present in the dataset', () => {
      const metrics = service.getAvailableMetrics();
      expect(metrics.length).toBe(31);
      expect(metrics).toContain('received');
      expect(metrics).toContain('appeals_received');
      expect(metrics).toContain('average_disposal_days');
    });

    it('should list all 278 distinct entities', () => {
      const entities = service.getAvailableEntities();
      expect(entities.length).toBe(278);
    });

    it('should list all 18 distinct dataset-period combinations', () => {
      const periods = service.getAvailablePeriods();
      expect(periods.length).toBe(18);
    });
  });
});
