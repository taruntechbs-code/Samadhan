/**
 * SAMADHAN — Backend API Integration Tests (Supertest)
 * Validates all HTTP endpoints, query parameters, error responses, CORS, and Intelligence API.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('SAMADHAN API Endpoints', () => {
  // 1. Health & Metadata
  describe('GET /api/health', () => {
    it('should return 200 with detailed telemetry and version info', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('samadhan-api');
      expect(res.body.version).toBe('0.6.0');
      expect(res.body.dataset.loaded).toBe(true);
      expect(res.body.dataset.rows).toBe(2134);
      expect(res.body.dataset.entitiesCount).toBe(278);
    });
  });

  describe('GET /api/meta', () => {
    it('should return 200 with complete system metadata and methodology', async () => {
      const res = await request(app).get('/api/meta');
      expect(res.status).toBe(200);
      expect(res.body.name).toContain('SAMADHAN');
      expect(res.body.event).toBe('Build What Moves India');
      expect(res.body.totalRowsParsed).toBe(2134);
      expect(res.body.reportingEntitiesCount).toBe(278);
      expect(res.body.availableDatasets.length).toBe(8);
      expect(res.body.methodology.riskScoring).toBeDefined();
    });
  });

  // 2. Actionable Intelligence Endpoints
  describe('Actionable Intelligence Endpoints', () => {
    it('GET /api/intelligence/overview returns executive findings & evidence', async () => {
      const res = await request(app).get('/api/intelligence/overview');
      expect(res.status).toBe(200);
      expect(res.body.title).toContain('CPGRAMS');
      expect(res.body.keyFindings.length).toBeGreaterThanOrEqual(3);
      expect(res.body.agingConcentration).toBeDefined();
      expect(res.body.evidence.length).toBeGreaterThan(0);
    });

    it('GET /api/intelligence/attention returns enriched risk with factors and recommendations', async () => {
      const res = await request(app).get('/api/intelligence/attention');
      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBeGreaterThan(0);
      expect(res.body.items[0].riskScore).toBeDefined();
      expect(res.body.items[0].factors).toBeDefined();
      expect(res.body.items[0].recommendations).toBeDefined();
      expect(res.body.items[0].evidence).toBeDefined();
    });

    it('GET /api/intelligence/departments/:entity returns full intelligence profile', async () => {
      const res = await request(app).get('/api/intelligence/departments/Labour%20and%20Employment');
      expect(res.status).toBe(200);
      expect(res.body.entity).toBe('Labour and Employment');
      expect(res.body.risk).toBeDefined();
      expect(res.body.performanceSummary).toContain('92.81%');
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      expect(res.body.evidence.length).toBeGreaterThan(0);
    });

    it('GET /api/intelligence/departments/:entity returns 404 for unknown department', async () => {
      const res = await request(app).get('/api/intelligence/departments/NonExistentDepartment');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('ENTITY_NOT_FOUND');
    });

    it('GET /api/intelligence/routing routes text with confidence & alternatives', async () => {
      const res = await request(app).get('/api/intelligence/routing?text=income%20tax%20refund%20delayed');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('MATCHED');
      expect(res.body.detectedCategory).toBe('Income Tax & Direct Taxation');
      expect(res.body.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(res.body.confidence).toBeGreaterThan(0.6);
      expect(res.body.disclaimer).toContain('Prototype routing');
    });

    it('GET /api/intelligence/routing returns 400 when text query parameter is missing', async () => {
      const res = await request(app).get('/api/intelligence/routing');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('ROUTING_INPUT_REQUIRED');
    });

    it('GET /api/intelligence/trends/:entity returns trend insights', async () => {
      const res = await request(app).get('/api/intelligence/trends/Uttar%20Pradesh');
      expect(res.status).toBe(200);
      expect(res.body.entity).toBe('Uttar Pradesh');
      expect(res.body.seriesCount).toBeGreaterThan(0);
      expect(res.body.trends[0].direction).toBeDefined();
    });
  });

  // 3. System Overview
  describe('GET /api/overview', () => {
    it('should return 200 with live 2026 system totals and source metadata', async () => {
      const res = await request(app).get('/api/overview');
      expect(res.status).toBe(200);
      expect(res.body.dataset).toBe('live_dashboard_2026');
      expect(res.body.entities).toBe(127);
      expect(res.body.received).toBe(2177902);
      expect(res.body.disposed).toBe(1902690);
      expect(res.body.disposalRate).toBe(87.36);
      expect(res.body.agingBuckets).toBeDefined();
      expect(res.body.source.sourceUrl).toContain('darpgdashboard');
    });

    it('should filter overview by scope', async () => {
      const res = await request(app).get('/api/overview?scope=Department');
      expect(res.status).toBe(200);
      expect(res.body.scopes).toEqual(['Department']);
      expect(res.body.entities).toBeLessThan(127);
    });
  });

  // 4. Department Summaries
  describe('GET /api/departments', () => {
    it('should return list of department summaries with count', async () => {
      const res = await request(app).get('/api/departments');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(278);
      expect(Array.isArray(res.body.departments)).toBe(true);
    });

    it('should filter departments by scope and disposal rate', async () => {
      const res = await request(app).get('/api/departments?scope=Department&minDisposalRate=95');
      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThan(0);
      for (const d of res.body.departments) {
        expect(d.scope).toBe('Department');
        expect(d.currentDisposalRate).toBeGreaterThanOrEqual(95);
      }
    });

    it('should return 400 for invalid disposal rate parameter', async () => {
      const res = await request(app).get('/api/departments?minDisposalRate=150');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_PARAMETER');
    });
  });

  // 5. Department Ranking
  describe('GET /api/departments/ranking', () => {
    it('should rank departments by received volume descending', async () => {
      const res = await request(app).get('/api/departments/ranking?sortBy=received&order=desc');
      expect(res.status).toBe(200);
      expect(res.body.sortBy).toBe('received');
      expect(res.body.ranking[0].entity).toBe('Uttar Pradesh');
      expect(res.body.ranking[0].received).toBe(232563);
    });

    it('should return 400 for invalid sortBy parameter', async () => {
      const res = await request(app).get('/api/departments/ranking?sortBy=invalid_metric');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_PARAMETER');
    });

    it('should return 400 for invalid order parameter', async () => {
      const res = await request(app).get('/api/departments/ranking?sortBy=received&order=diagonal');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_PARAMETER');
    });
  });

  // 6. Department Detail
  describe('GET /api/departments/:entity', () => {
    it('should return detail for an existing entity', async () => {
      const res = await request(app).get('/api/departments/Labour%20and%20Employment');
      expect(res.status).toBe(200);
      expect(res.body.entity).toBe('Labour and Employment');
      expect(res.body.currentPeriod.received).toBe(225395);
      expect(res.body.currentPeriod.disposalRate).toBe(92.81);
      expect(res.body.currentPeriod.agingBuckets['0_60_days']).toBe(15291);
      expect(res.body.historicalPerformance).toBeDefined();
    });

    it('should return 404 for unknown department', async () => {
      const res = await request(app).get('/api/departments/Unknown%20Department%20XYZ');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('ENTITY_NOT_FOUND');
    });
  });

  // 7. Attention Required
  describe('GET /api/attention', () => {
    it('should return attention required list with severity triage', async () => {
      const res = await request(app).get('/api/attention');
      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBeGreaterThan(0);
      expect(res.body.criticalCount).toBeGreaterThan(0);
      expect(Array.isArray(res.body.items)).toBe(true);

      for (const item of res.body.items) {
        expect(item.severity).toMatch(/CRITICAL|WARNING/);
        expect(item.reason).toBeTruthy();
        expect(item.metric).toBeTruthy();
      }
    });

    it('should allow configurable disposal threshold query params', async () => {
      const res = await request(app).get('/api/attention?criticalDisposalRateThreshold=50');
      expect(res.status).toBe(200);
      const criticals = res.body.items.filter((i: any) => i.severity === 'CRITICAL');
      expect(criticals.length).toBeLessThan(res.body.totalCount);
    });
  });

  // 8. Aging Analysis
  describe('GET /api/aging', () => {
    it('should return system-wide 4-bucket aging analysis', async () => {
      const res = await request(app).get('/api/aging');
      expect(res.status).toBe(200);
      expect(res.body.aging['0_60_days']).toBe(196528);
      expect(res.body.aging['60_180_days']).toBe(67094);
      expect(res.body.aging['180_365_days']).toBe(11590);
      expect(res.body.aging['over_1_year']).toBe(0);
      expect(res.body.aging.total).toBe(275212);
    });

    it('should return entity-specific aging breakdown', async () => {
      const res = await request(app).get('/api/aging?entity=Uttar%20Pradesh');
      expect(res.status).toBe(200);
      expect(res.body.entity).toBe('Uttar Pradesh');
      expect(res.body.aging['0_60_days']).toBe(35981);
      expect(res.body.aging.total).toBe(37877);
    });
  });

  // 9. Trends
  describe('GET /api/trends', () => {
    it('should return trend series partitioned by dataset', async () => {
      const res = await request(app).get('/api/trends?dataset=monthly_central_2026');
      expect(res.status).toBe(200);
      expect(res.body.seriesCount).toBe(1);
      expect(res.body.series[0].points.length).toBe(6);
    });
  });

  // 10. Appeals
  describe('GET /api/appeals', () => {
    it('should return appeals intelligence snapshot', async () => {
      const res = await request(app).get('/api/appeals');
      expect(res.status).toBe(200);
      expect(res.body.dataset).toBe('appeal_dashboard_2026-08-25');
      expect(res.body.appealsReceived).toBe(230602);
      expect(res.body.appealsDisposed).toBe(214501);
      expect(res.body.appealDisposalRate).toBe(93.02);
      expect(res.body.departmentCount).toBe(88);
    });
  });

  // 11. Metadata Endpoints
  describe('Metadata endpoints', () => {
    it('GET /api/entities returns 278 entities', async () => {
      const res = await request(app).get('/api/entities');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(278);
    });

    it('GET /api/periods returns 18 distinct dataset-periods', async () => {
      const res = await request(app).get('/api/periods');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(18);
    });

    it('GET /api/metrics returns 31 distinct metrics', async () => {
      const res = await request(app).get('/api/metrics');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(31);
      expect(res.body.metrics).toContain('disposed');
      expect(res.body.metrics).toContain('appeals_received');
    });
  });

  // 12. Raw Metric Query
  describe('GET /api/metrics/:metric', () => {
    it('should return raw rows for valid metric', async () => {
      const res = await request(app).get('/api/metrics/received');
      expect(res.status).toBe(200);
      expect(res.body.metric).toBe('received');
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should return 400 for invalid/unknown metric', async () => {
      const res = await request(app).get('/api/metrics/non_existent_metric');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('METRIC_NOT_FOUND');
    });
  });

  // 13. Undefined Route 404
  describe('Undefined /api/* route', () => {
    it('should return 404 with structured error JSON', async () => {
      const res = await request(app).get('/api/non_existent_endpoint');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
