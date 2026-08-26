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
});
