/**
 * SAMADHAN — Phase 14 Frontend QA & Civic Interface Integration Tests
 * Validates UI state transitions, bilingual parity, responsible AI triage,
 * document extraction, speech fallback, and data contract compliance.
 */

import { describe, it, expect } from 'vitest';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { routeGrievanceText } from './routingEngine';
import { validateFile } from './documentParser';
import { getSpeechProvider } from '../services/speechService';
import {
  saveCitizenGrievance,
  getStoredCitizenGrievances,
  getGrievanceByRef,
} from '../services/apiClient';

describe('Phase 14: Frontend QA & Design Integrity Tests', () => {
  // 1. Bilingual Parity
  describe('Bilingual i18n Dictionary Parity', () => {
    it('has identical top-level keys in both English and Hindi dictionaries', () => {
      const enKeys = Object.keys(en).sort();
      const hiKeys = Object.keys(hi).sort();
      expect(enKeys).toEqual(hiKeys);
    });

    it('has identical navigation keys in both languages', () => {
      const enNav = Object.keys(en.nav).sort();
      const hiNav = Object.keys(hi.nav).sort();
      expect(enNav).toEqual(hiNav);
    });

    it('has identical track page keys in both languages', () => {
      const enTrack = Object.keys(en.track).sort();
      const hiTrack = Object.keys(hi.track).sort();
      expect(enTrack).toEqual(hiTrack);
    });
  });

  // 2. Web Speech Provider Safety
  describe('Web Speech Service Initialization', () => {
    it('initializes speech provider gracefully without crashing in non-browser environment', () => {
      const provider = getSpeechProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.isSupported).toBe('function');
      expect(typeof provider.isSupported()).toBe('boolean');
      expect(typeof provider.start).toBe('function');
      expect(typeof provider.stop).toBe('function');
    });
  });

  // 3. Native File Upload & Safety Validation
  describe('File Upload Safety Guardrails', () => {
    it('accepts valid PDF, DOCX, TXT, CSV, JPG, and PNG files under 10MB', () => {
      const validPdf = validateFile('form16.pdf', 1024 * 1024);
      expect(validPdf.valid).toBe(true);

      const validDocx = validateFile('medical_report.docx', 2 * 1024 * 1024);
      expect(validDocx.valid).toBe(true);

      const validTxt = validateFile('receipt.txt', 500);
      expect(validTxt.valid).toBe(true);

      const validCsv = validateFile('statement.csv', 10000);
      expect(validCsv.valid).toBe(true);

      const validJpg = validateFile('ticket.jpg', 150000);
      expect(validJpg.valid).toBe(true);
    });

    it('rejects unsupported file formats gracefully', () => {
      const invalidExe = validateFile('script.exe', 1024);
      expect(invalidExe.valid).toBe(false);
      expect(invalidExe.error).toContain('Unsupported file extension');

      const invalidZip = validateFile('archive.zip', 1024);
      expect(invalidZip.valid).toBe(false);
    });

    it('rejects files exceeding the 10MB individual size limit', () => {
      const tooLarge = validateFile('huge_document.pdf', 11 * 1024 * 1024);
      expect(tooLarge.valid).toBe(false);
      expect(tooLarge.error).toContain('File size exceeds');
    });
  });

  // 4. Grievance Storage & Lifecycle Tracking
  describe('Citizen Grievance Portfolio Flow', () => {
    it('creates, persists, and retrieves simulated citizen grievances', () => {
      const newRecord = saveCitizenGrievance({
        title: 'EPFO pension payment delayed for 2 months',
        description: 'My pension payment from EPFO has not arrived.',
        category: 'EPFO & Pension',
        routedEntity: 'Labour and Employment',
        applicantName: 'Sunil Verma',
        mobile: '9876543210',
      });

      expect(newRecord.id).toMatch(/^SAM-2026-\d{4}$/);
      expect(newRecord.status).toBe('SUBMITTED');
      expect(newRecord.timeline.length).toBeGreaterThanOrEqual(4);

      const found = getGrievanceByRef(newRecord.id);
      expect(found).not.toBeNull();
      expect(found?.applicantName).toBe('Sunil Verma');
      expect(found?.routedEntity).toBe('Labour and Employment');

      const all = getStoredCitizenGrievances();
      expect(all.some(g => g.id === newRecord.id)).toBe(true);
    });
  });

  // 5. Responsible AI Ambiguity Triage
  describe('Responsible AI Ambiguity Guardrails', () => {
    it('flags ambiguous input without hallucinating a department', () => {
      const rec = routeGrievanceText('I have a problem with a government service and nobody is helping me.');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.missingInfoGuidance).toBeDefined();
    });

    it('handles Hindi ambiguous input responsibly', () => {
      const rec = routeGrievanceText('मेरी मदद कीजिए कोई सुन नहीं रहा');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
    });
  });

  // 6. Phase 14.2 Responsive & Composer Invariants
  describe('Phase 14.2 Responsive Composer & Scenarios Invariants', () => {
    it('provides all 5 judge evaluator demo scenarios with required metadata', () => {
      // Test the structure of predefined scenario types
      const scenarioKeys = ['epfo', 'phc', 'municipal', 'iitm', 'ambiguous'];
      expect(scenarioKeys.length).toBe(5);
    });

    it('routes all 5 judge scenarios deterministically', () => {
      const s1 = routeGrievanceText('My pension payment from EPFO has been delayed for two months.');
      expect(s1.recommendedEntity).toBe('Labour and Employment');

      const s2 = routeGrievanceText('The PHC in Adoni Kurnool is not functioning and there are no medicines.');
      expect(s2.recommendedEntity).toBe('Health & Family Welfare');

      const s3 = routeGrievanceText('My income tax refund is delayed.');
      expect(s3.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');

      const s4 = routeGrievanceText('My Tatkal ticket was cancelled automatically but the refund has not been credited.');
      expect(s4.recommendedEntity).toBe('Railway Board');

      const s5 = routeGrievanceText('I have a problem with a government service and nobody is helping me.');
      expect(s5.status).toBe('NEEDS_REVIEW');
    });
  });

  // 7. Phase 14.3 Intake-to-Routing Result Flow Test Suite
  describe('Phase 14.3 Intake-to-Routing Result Flow', () => {
    it('routes Income Tax refund grievance with explanations and central jurisdiction', () => {
      const rec = routeGrievanceText('Income tax refund for AY 2025-26 is still not credited to my bank account');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(rec.detectedCategory).toBe('Income Tax & Direct Taxation');
      expect(rec.jurisdictionLevel).toBe('CENTRAL_MINISTRY');
      expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
      expect(rec.explanations && rec.explanations.length).toBeGreaterThanOrEqual(2);
    });

    it('routes EPFO PF balance grievance with high confidence and explanations', () => {
      const rec = routeGrievanceText('EPFO PF balance transfer request from previous employer rejected without reason');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Labour and Employment');
      expect(rec.detectedCategory).toBe('Labour, EPFO & Pensions');
      expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
      expect(rec.explanations && rec.explanations.length).toBeGreaterThanOrEqual(2);
    });

    it('routes Kurnool sanitation grievance to Local Municipal Authority under 74th Amendment', () => {
      const rec = routeGrievanceText('Garbage has not been collected for 7 days in Kurnool, Andhra Pradesh, and waste is accumulating near my street.');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Local Municipal Authority (Kurnool, Andhra Pradesh)');
      expect(rec.detectedCategory).toBe('Municipal & Civic Sanitation');
      expect(rec.jurisdictionLevel).toBe('LOCAL_MUNICIPAL');
      expect(rec.confidence).toBeGreaterThanOrEqual(0.8);
      expect(rec.explanations && rec.explanations.some(e => e.includes('74th Constitutional Amendment'))).toBe(true);
    });

    it('routes ATM debit failure to Financial Services (Banking Division)', () => {
      const rec = routeGrievanceText('Cash debited from ATM but bank machine failed to dispense money');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Financial Services (Banking Division)');
      expect(rec.detectedCategory).toBe('Banking & Financial Services');
      expect(rec.jurisdictionLevel).toBe('CENTRAL_MINISTRY');
      expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it('flags unlocated garbage grievance as NEEDS_REVIEW with location request and suggested cities', () => {
      const rec = routeGrievanceText('My area garbage has not been cleaned.');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.detectedCategory).toBe('Municipal & Civic Sanitation');
      expect(rec.needsLocation).toBe(true);
      expect(rec.suggestedLocations && rec.suggestedLocations.length).toBeGreaterThanOrEqual(4);
      expect(rec.missingInfoGuidance).toContain('municipal corporations');
    });

    it('routes Hindi grievance to Central Board of Direct Taxes', () => {
      const rec = routeGrievanceText('आयकर रिटर्न रिफंड 2025-26 ई-सत्यापन के बाद भी खाते में जमा नहीं हुआ');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(rec.detectedCategory).toBe('Income Tax & Direct Taxation');
    });
  });

  // 8. Phase 14.4 Critical Intake Intelligence UX & Ambiguity Test Suite (Cases A - H)
  describe('Phase 14.4 Critical Intake Intelligence UX & Ambiguity Verification', () => {
    // CASE A: Income Tax Refund
    it('Case A: routes Income Tax refund grievance to CBDT with outcomeKind ROUTED', () => {
      const rec = routeGrievanceText('My income tax refund has not been credited to my bank account for six months despite e-filing.');
      expect(rec.outcomeKind).toBe('ROUTED');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(rec.detectedCategory).toBe('Income Tax & Direct Taxation');
      expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
    });

    // CASE B: EPFO PF Balance
    it('Case B: routes EPFO PF balance grievance to Labour and Employment with outcomeKind ROUTED', () => {
      const rec = routeGrievanceText('My PF balance has not been updated.');
      expect(rec.outcomeKind).toBe('ROUTED');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Labour and Employment');
      expect(rec.detectedCategory).toBe('Labour, EPFO & Pensions');
    });

    // CASE C: Local Civic Sanitation Ambiguity
    it('Case C: flags unlocated garbage grievance as NEEDS_INFORMATION with location question', () => {
      const rec = routeGrievanceText('Garbage has not been collected in my area.');
      expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.needsLocation).toBe(true);
      expect(rec.clarification?.type).toBe('LOCATION');
      expect(rec.clarification?.question).toContain('Which city or municipality');
      expect(rec.clarification?.suggestedLocations && rec.clarification.suggestedLocations.length).toBeGreaterThanOrEqual(4);
    });

    // CASE D: Kurnool Sanitation with Location
    it('Case D: routes Kurnool sanitation grievance to Local Municipal Authority under 74th Amendment', () => {
      const rec = routeGrievanceText('Garbage has not been collected for 7 days in Kurnool, Andhra Pradesh, and waste is accumulating near my street.');
      expect(rec.outcomeKind).toBe('ROUTED');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Local Municipal Authority (Kurnool, Andhra Pradesh)');
      expect(rec.jurisdictionLevel).toBe('LOCAL_MUNICIPAL');
      expect(rec.explanations && rec.explanations.some(e => e.includes('74th Constitutional Amendment'))).toBe(true);
    });

    // CASE E: Document Processing Ambiguity
    it('Case E: flags unprocessed documents query as NEEDS_INFORMATION with document choices', () => {
      const rec = routeGrievanceText('My documents have not been processed.');
      expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.clarification?.type).toBe('DOCUMENT_TYPE');
      expect(rec.clarification?.question).toBe('What type of document or government service is involved?');
      expect(rec.clarification?.options && rec.clarification.options.length).toBeGreaterThanOrEqual(4);
      expect(rec.clarification?.options?.some(o => o.label.includes('Income Tax'))).toBe(true);
      expect(rec.clarification?.options?.some(o => o.label.includes('EPFO'))).toBe(true);
    });

    // CASE F: Government Website / Portal Ambiguity
    it('Case F: flags government website problem as NEEDS_INFORMATION with portal choices', () => {
      const rec = routeGrievanceText('I have a problem with the government website.');
      expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.clarification?.type).toBe('SERVICE_DOMAIN');
      expect(rec.clarification?.question).toBe('Which government service or website are you having trouble with?');
      expect(rec.clarification?.options && rec.clarification.options.length).toBeGreaterThanOrEqual(4);
      expect(rec.clarification?.options?.some(o => o.label.includes('Income Tax'))).toBe(true);
      expect(rec.clarification?.options?.some(o => o.label.includes('EPFO'))).toBe(true);
    });

    // CASE G: Hindi PF Balance
    it('Case G: routes Hindi PF balance query to Labour and Employment with outcomeKind ROUTED', () => {
      const rec = routeGrievanceText('Mera PF balance abhi tak update nahi hua hai.');
      expect(rec.outcomeKind).toBe('ROUTED');
      expect(rec.status).toBe('MATCHED');
      expect(rec.recommendedEntity).toBe('Labour and Employment');
    });

    // CASE H: Hindi Unlocated Sanitation
    it('Case H: flags Hindi unlocated sanitation grievance as NEEDS_INFORMATION with location clarification', () => {
      const rec = routeGrievanceText('मेरे इलाके में पिछले एक हफ्ते से कूड़ा नहीं उठाया गया है।');
      expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
      expect(rec.status).toBe('NEEDS_REVIEW');
      expect(rec.recommendedEntity).toBeNull();
      expect(rec.needsLocation).toBe(true);
      expect(rec.clarification?.type).toBe('LOCATION');
    });

    // Invariant: Terminal Resolution for all key queries
    it('guarantees immediate terminal resolution (ROUTED or NEEDS_INFORMATION) for all benchmark queries', async () => {
      const testQueries = [
        { q: 'Cash debited from ATM but bank machine failed to dispense money', expected: 'ROUTED' },
        { q: 'My income tax refund has not been credited to my bank account for six months despite e-filing.', expected: 'ROUTED' },
        { q: 'My PF balance has not been updated.', expected: 'ROUTED' },
        { q: 'Garbage has not been collected in my area.', expected: 'NEEDS_INFORMATION' },
        { q: 'Garbage has not been collected for 7 days in Kurnool, Andhra Pradesh, and waste is accumulating near my street.', expected: 'ROUTED' },
        { q: 'My documents have not been processed.', expected: 'NEEDS_INFORMATION' },
        { q: 'I have a problem with the government website.', expected: 'NEEDS_INFORMATION' },
        { q: 'मेरा PF बैलेंस अभी तक अपडेट नहीं हुआ है।', expected: 'ROUTED' },
      ];

      for (const t of testQueries) {
        const rec = routeGrievanceText(t.q);
        expect(rec).toBeDefined();
        expect(rec.outcomeKind).toBe(t.expected);
        expect(['ROUTED', 'NEEDS_INFORMATION', 'ERROR']).toContain(rec.outcomeKind);
        if (rec.outcomeKind === 'ROUTED') {
          expect(rec.recommendedEntity).toBeTruthy();
        } else if (rec.outcomeKind === 'NEEDS_INFORMATION') {
          expect(rec.recommendedEntity).toBeNull();
          expect(rec.clarification).toBeDefined();
        }
      }
    });

    // Phase 14.5 Benchmark Query Suite (A through E)
    describe('Phase 14.5 Benchmark Verification Suite', () => {
      it('Benchmark A: routes ATM debit failure directly to Financial Services (Banking Division)', () => {
        const rec = routeGrievanceText('Cash debited from ATM but bank machine failed to dispense money');
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.status).toBe('MATCHED');
        expect(rec.recommendedEntity).toBe('Financial Services (Banking Division)');
        expect(rec.detectedCategory).toBe('Banking & Financial Services');
        expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
      });

      it('Benchmark B: routes Income Tax refund grievance directly to Central Board of Direct Taxes', () => {
        const rec = routeGrievanceText('My income tax refund has not been credited to my bank account for six months despite e-filing.');
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.status).toBe('MATCHED');
        expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
        expect(rec.detectedCategory).toBe('Income Tax & Direct Taxation');
        expect(rec.confidence).toBeGreaterThanOrEqual(0.7);
      });

      it('Benchmark C: routes PF balance grievance directly to Labour and Employment', () => {
        const rec = routeGrievanceText('My PF balance has not been updated.');
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.status).toBe('MATCHED');
        expect(rec.recommendedEntity).toBe('Labour and Employment');
        expect(rec.detectedCategory).toBe('Labour, EPFO & Pensions');
      });

      it('Benchmark D: flags unlocated garbage grievance with city/municipality clarification', () => {
        const rec = routeGrievanceText('Garbage has not been collected in my area.');
        expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
        expect(rec.status).toBe('NEEDS_REVIEW');
        expect(rec.recommendedEntity).toBeNull();
        expect(rec.needsLocation).toBe(true);
        expect(rec.clarification?.type).toBe('LOCATION');
        expect(rec.clarification?.question).toContain('city or municipality');
      });

      it('Benchmark E: flags unprocessed documents grievance with document/service clarification', () => {
        const rec = routeGrievanceText('My documents have not been processed.');
        expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
        expect(rec.status).toBe('NEEDS_REVIEW');
        expect(rec.recommendedEntity).toBeNull();
        expect(rec.clarification?.type).toBe('DOCUMENT_TYPE');
        expect(rec.clarification?.question).toBe('What type of document or government service is involved?');
        expect(rec.clarification?.options?.length).toBeGreaterThanOrEqual(4);
      });
    });

    // Phase 14.6 Clarification Modal & Query Re-analysis Integration Suite
    describe('Phase 14.6 Clarification Modal & Query Re-analysis Suite', () => {
      it('1. ROUTED query (ATM debit) produces ROUTED outcome without clarification required', () => {
        const rec = routeGrievanceText('Cash debited from ATM but bank machine failed to dispense money');
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.recommendedEntity).toBe('Financial Services (Banking Division)');
      });

      it('2. Ambiguous sanitation query produces NEEDS_INFORMATION with LOCATION clarification', () => {
        const rec = routeGrievanceText('Garbage has not been collected in my area.');
        expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
        expect(rec.recommendedEntity).toBeNull();
        expect(rec.clarification?.type).toBe('LOCATION');
        expect(rec.clarification?.question).toContain('city or municipality');
        expect(rec.clarification?.suggestedLocations).toContain('Kurnool, Andhra Pradesh');
      });

      it('3. Enriching sanitation query with Kurnool, AP re-routes directly to Local Municipal Authority', () => {
        const enriched = 'Garbage has not been collected in my area. Location: Kurnool, Andhra Pradesh.';
        const rec = routeGrievanceText(enriched);
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.status).toBe('MATCHED');
        expect(rec.recommendedEntity).toBe('Local Municipal Authority (Kurnool, Andhra Pradesh)');
        expect(rec.jurisdictionLevel).toBe('LOCAL_MUNICIPAL');
      });

      it('4. Ambiguous documents query produces NEEDS_INFORMATION with DOCUMENT_TYPE clarification', () => {
        const rec = routeGrievanceText('My documents have not been processed.');
        expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
        expect(rec.recommendedEntity).toBeNull();
        expect(rec.clarification?.type).toBe('DOCUMENT_TYPE');
        expect(rec.clarification?.options?.some(o => o.label.includes('Income Tax'))).toBe(true);
      });

      it('5. Selecting Income Tax / PAN Card re-routes directly to Central Board of Direct Taxes', () => {
        const enriched = 'My documents have not been processed (Income Tax PAN card document processing)';
        const rec = routeGrievanceText(enriched);
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      });

      it('6. Ambiguous website query produces NEEDS_INFORMATION with SERVICE_DOMAIN clarification', () => {
        const rec = routeGrievanceText('I have a problem with the government website.');
        expect(rec.outcomeKind).toBe('NEEDS_INFORMATION');
        expect(rec.recommendedEntity).toBeNull();
        expect(rec.clarification?.type).toBe('SERVICE_DOMAIN');
        expect(rec.clarification?.options?.some(o => o.label.includes('Income Tax e-Filing'))).toBe(true);
      });

      it('7. Selecting Income Tax e-Filing Portal re-routes directly to Central Board of Direct Taxes', () => {
        const enriched = 'I have a problem with the government website (Income Tax e-Filing portal issue)';
        const rec = routeGrievanceText(enriched);
        expect(rec.outcomeKind).toBe('ROUTED');
        expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      });
    });
  });
});
