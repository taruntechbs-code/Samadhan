/**
 * SAMADHAN — Phase 13 End-to-End Judge & Evaluator Scenario Test Suite
 * Validates all 5 official evaluator scenarios, Hindi queries, RAG document enrichment,
 * facility resolution, responsible AI guardrails, and historical data contracts.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { routeGrievanceText } from './routingEngine';
import { parseDocument } from './documentParser';
import { parseCpgramsCsv } from '../data/csvLoader';
import { CpgramsService, initializeCpgramsService } from '../services/cpgramsService';
import { searchFacilities } from '../data/facilityDirectory';
import { getDepartmentHistoricalComparison, getAllHistoricalComparisons } from '../data/cpgramsHistorical';

describe('Phase 13: End-to-End Judge & Evaluator Scenarios', () => {
  let service: CpgramsService;

  beforeAll(() => {
    const csvPath = path.resolve(process.cwd(), '10_MASTER_verified_cpgrams_metrics_long.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const parseResult = parseCpgramsCsv(csvContent);
    service = initializeCpgramsService(parseResult.normalizedRows);
  });

  // SCENARIO 1: EPFO / Pension Payment Delay
  it('Scenario 1: routes EPFO pension delay to Labour & Employment with historical baseline', () => {
    const query = 'My pension payment from EPFO has been delayed for two months.';
    const rec = routeGrievanceText(query);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Labour and Employment');
    expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
    expect(rec.matchReason).toContain('Labour, EPFO & Pensions');

    // Verify historical baseline exists for this entity
    const hist = getDepartmentHistoricalComparison(rec.recommendedEntity!, service);
    expect(hist).not.toBeNull();
    expect(hist?.hasHistoricalBaseline).toBe(true);
    expect(hist?.historicalDisposalRate).toBe(98.77);
    expect(hist?.varianceDisposalRate).toBe(-5.96);
    expect(hist?.trend).toBe('DETERIORATING');
  });

  // SCENARIO 2: Healthcare & PHC Adoni Facility
  it('Scenario 2: routes PHC grievance to Health & Family Welfare and resolves facility', () => {
    const query = 'The PHC in Adoni Kurnool is not functioning and there are no medicines.';
    const rec = routeGrievanceText(query);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Health & Family Welfare');
    expect(rec.facilityDomain).toBe('HEALTHCARE');

    // Resolve facility in directory
    const facilities = searchFacilities({ q: 'Adoni Kurnool', limit: 5 });
    expect(facilities.total).toBeGreaterThan(0);
    const top = facilities.results[0];
    expect(top.district.toLowerCase()).toContain('kurnool');
    expect(top.facilityName.toLowerCase()).toContain('adoni');
  });

  // SCENARIO 3: Income Tax Refund
  it('Scenario 3: routes income tax refund to CBDT with high confidence', () => {
    const query = 'My income tax refund is delayed.';
    const rec = routeGrievanceText(query);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    expect(rec.confidence).toBeGreaterThanOrEqual(0.85);
  });

  // SCENARIO 4: Railway Tatkal Refund
  it('Scenario 4: routes Tatkal ticket cancellation refund to Railway Board', () => {
    const query = 'My Tatkal ticket was cancelled automatically but the refund has not been credited.';
    const rec = routeGrievanceText(query);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Railway Board');
    expect(rec.confidence).toBeGreaterThanOrEqual(0.75);
  });

  // SCENARIO 5: Ambiguous Query / Responsible AI
  it('Scenario 5: flags vague input as NEEDS_REVIEW without fabricating an authority', () => {
    const query = 'I have a problem with a government service and nobody is helping me.';
    const rec = routeGrievanceText(query);

    expect(rec.status).toBe('NEEDS_REVIEW');
    expect(rec.recommendedEntity).toBeNull();
    expect(rec.missingInfoGuidance).toBeDefined();
    expect(rec.missingInfoGuidance?.length).toBeGreaterThan(10);
    expect(rec.matchReason).toContain('general distress');
  });

  // BILINGUAL HINDI ROUTING
  describe('Bilingual Hindi Intake Scenarios', () => {
    it('routes Hindi Income Tax grievance to CBDT', () => {
      const query = 'मेरा आयकर रिटर्न रिफंड ई-सत्यापन के बाद भी खाते में नहीं आया है';
      const rec = routeGrievanceText(query);

      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    });

    it('routes Hindi EPFO grievance to Labour & Employment', () => {
      const query = 'मेरा ईपीएफओ भविष्य निधि ट्रांसफर क्लेम रिजेक्ट हो गया है';
      const rec = routeGrievanceText(query);

      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Labour and Employment');
    });
  });

  // DOCUMENT + RAG RETRIEVAL ENRICHMENT
  describe('Document Evidence & RAG Enrichment', () => {
    it('enriches short query with document text and extracts metadata', () => {
      const doc = parseDocument(
        'income_tax_order.txt',
        'Income Tax Department Intimation u/s 143(1). PAN: ABCDE1234F AY 2025-26. Refund amount of Rs. 14,500 held due to bank account validation.'
      );

      const rec = routeGrievanceText('My refund is stuck', [doc]);
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(rec.documentEvidence).toBeDefined();
      expect(rec.documentEvidence?.totalAnalyzed).toBe(1);
      expect(rec.documentEvidence?.documents[0].referenceNumbers).toContain('PAN: ABCDE1234F');
      expect(rec.documentEvidence?.documents[0].matchedSnippet).toContain('Refund amount of Rs. 14,500');
    });

    it('does not allow an irrelevant document to override a clear citizen query', () => {
      const doc = parseDocument(
        'train_ticket.txt',
        'IRCTC e-Ticketing PNR: 2849102841 Train 12951 Mumbai Rajdhani Express.'
      );

      const rec = routeGrievanceText('Income tax refund delayed for 6 months', [doc]);
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    });
  });

  // HISTORICAL DATA INTEGRITY
  describe('Historical Intelligence Data Integrity', () => {
    it('guarantees all comparisons return non-null entity and valid numbers', () => {
      const comparisons = getAllHistoricalComparisons(service);
      expect(comparisons.length).toBeGreaterThan(50);

      for (const comp of comparisons) {
        expect(typeof comp.entity).toBe('string');
        expect(comp.entity.length).toBeGreaterThan(0);
        expect(typeof comp.currentDisposalRate).toBe('number');
        expect(typeof comp.hasHistoricalBaseline).toBe('boolean');
        expect(['IMPROVING', 'STABLE', 'DETERIORATING', 'INSUFFICIENT_HISTORY']).toContain(comp.trend);
      }
    });
  });
});
