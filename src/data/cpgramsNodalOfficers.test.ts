import { describe, it, expect } from 'vitest';
import {
  CPGRAMS_CENTRAL_NODAL_OFFICERS,
  CPGRAMS_STATE_NODAL_OFFICERS,
  findNodalOfficer,
  normalizeOrgName,
} from './cpgramsNodalOfficers';
import { routeGrievanceText } from '../intelligence/routingEngine';

describe('Verified CPGRAMS Nodal Public Grievance Officer Intelligence (Phase 14.7)', () => {
  describe('Dataset Integrity & Provenance', () => {
    it('contains all 92 Central Ministry/Department officer records from official CPGRAMS', () => {
      expect(CPGRAMS_CENTRAL_NODAL_OFFICERS.length).toBe(92);
    });

    it('contains all 37 State/UT officer records from official CPGRAMS', () => {
      expect(CPGRAMS_STATE_NODAL_OFFICERS.length).toBe(37);
    });

    it('has zero duplicate organisation records in Central and State directories', () => {
      const centralOrgs = new Set<string>();
      for (const c of CPGRAMS_CENTRAL_NODAL_OFFICERS) {
        expect(centralOrgs.has(c.organisation)).toBe(false);
        centralOrgs.add(c.organisation);
      }

      const stateOrgs = new Set<string>();
      for (const s of CPGRAMS_STATE_NODAL_OFFICERS) {
        expect(stateOrgs.has(s.organisation)).toBe(false);
        stateOrgs.add(s.organisation);
      }
    });

    it('ensures every officer record has complete mandatory statutory fields and source URL', () => {
      const all = [...CPGRAMS_CENTRAL_NODAL_OFFICERS, ...CPGRAMS_STATE_NODAL_OFFICERS];
      for (const off of all) {
        expect(off.organisation.trim().length).toBeGreaterThan(0);
        expect(off.name.trim().length).toBeGreaterThan(0);
        expect(off.designation.trim().length).toBeGreaterThan(0);
        expect(off.sourceUrl).toMatch(/^https:\/\/pgportal\.gov\.in/);
        expect(['CENTRAL', 'STATE_UT']).toContain(off.sourceType);
        expect(off.verifiedAt).toBe('2026-08-26');
      }
    });

    it('ensures all emails are cleanly normalized without [at] or [dot] tokens', () => {
      const all = [...CPGRAMS_CENTRAL_NODAL_OFFICERS, ...CPGRAMS_STATE_NODAL_OFFICERS];
      for (const off of all) {
        if (off.email) {
          expect(off.email).not.toContain('[at]');
          expect(off.email).not.toContain('[dot]');
          expect(off.email).toContain('@');
        }
      }
    });

    it('ensures no placeholder or fabricated values exist in contact fields', () => {
      const all = [...CPGRAMS_CENTRAL_NODAL_OFFICERS, ...CPGRAMS_STATE_NODAL_OFFICERS];
      const placeholders = ['test', 'dummy', 'lorem', 'fake', '1234567890', 'none@none', 'example.com'];
      for (const off of all) {
        for (const p of placeholders) {
          expect(off.name.toLowerCase()).not.toBe(p);
          if (off.phone) expect(off.phone).not.toBe(p);
          if (off.email) expect(off.email.toLowerCase()).not.toContain(p);
        }
      }
    });
  });

  describe('Benchmark Grievance Routing Scenarios', () => {
    it('Scenario 1: ATM Grievance -> Financial Services (Banking Division) with SHRI SWAPNIL AGRAWAL', () => {
      const query = 'Cash debited from ATM but bank machine failed to dispense money';
      const routing = routeGrievanceText(query);

      expect(routing.outcomeKind).toBe('ROUTED');
      expect(routing.recommendedEntity).toBe('Financial Services (Banking Division)');
      expect(routing.nodalOfficer).toBeDefined();
      expect(routing.nodalOfficer?.organisation).toBe('Financial Services (Banking Division)');
      expect(routing.nodalOfficer?.name).toBe('SHRI SWAPNIL AGRAWAL');
      expect(routing.nodalOfficer?.designation).toBe('DIRECTOR');
      expect(routing.nodalOfficer?.phone).toBe('01123346785');
      expect(routing.nodalOfficer?.email).toBe('dir.sa-dfs@gov.in');
      expect(routing.nodalOfficer?.sourceType).toBe('CENTRAL');
    });

    it('Scenario 2: Income Tax Grievance -> Central Board of Direct Taxes (Income Tax)', () => {
      const query = 'My income tax refund has not been credited to my bank account for six months despite e-filing.';
      const routing = routeGrievanceText(query);

      expect(routing.outcomeKind).toBe('ROUTED');
      expect(routing.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(routing.nodalOfficer).toBeDefined();
      expect(routing.nodalOfficer?.organisation).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(routing.nodalOfficer?.name).toBe('Swapna Devireddy');
      expect(routing.nodalOfficer?.designation).toBe('Addl. Director of Income Tax TPS-II');
      expect(routing.nodalOfficer?.email).toBe('delhi.addldit.eservices@incometax.gov.in');
      expect(routing.nodalOfficer?.phone).toBe('01123416133');
    });

    it('Scenario 3: PF Grievance -> Labour and Employment', () => {
      const query = 'My PF balance has not been updated.';
      const routing = routeGrievanceText(query);

      expect(routing.outcomeKind).toBe('ROUTED');
      expect(routing.recommendedEntity).toBe('Labour and Employment');
      expect(routing.nodalOfficer).toBeDefined();
      expect(routing.nodalOfficer?.organisation).toBe('Labour and Employment');
      expect(routing.nodalOfficer?.name).toBe('Shri G. Sajith Kumar');
      expect(routing.nodalOfficer?.designation).toBe('Deputy Secretary and Nodal PGO');
      expect(routing.nodalOfficer?.email).toBe('sajith.edu@nic.in');
      expect(routing.nodalOfficer?.phone).toBe('01123719054');
    });

    it('Scenario 4: Kurnool Sanitation -> Local Municipal Authority with Andhra Pradesh State Nodal Officer', () => {
      const query = 'Garbage has not been collected for 7 days in Kurnool, Andhra Pradesh.';
      const routing = routeGrievanceText(query);

      expect(routing.outcomeKind).toBe('ROUTED');
      expect(routing.recommendedEntity).toBe('Local Municipal Authority (Kurnool, Andhra Pradesh)');
      expect(routing.jurisdictionLevel).toBe('LOCAL_MUNICIPAL');
      expect(routing.nodalOfficer).toBeDefined();
      expect(routing.nodalOfficer?.organisation).toBe('Andhra Pradesh');
      expect(routing.nodalOfficer?.name).toBe('Chinna Rao');
      expect(routing.nodalOfficer?.designation).toBe('CGO-CMO');
      expect(routing.nodalOfficer?.phone).toBe('09154267973');
      expect(routing.nodalOfficer?.email).toBe('pgrs-helpdesk@ap.gov.in');
      expect(routing.nodalOfficer?.sourceType).toBe('STATE_UT');
    });

    it('Scenario 5: Ambiguous Sanitation -> NEEDS_INFORMATION with no Nodal Officer before resolution', () => {
      const query = 'Garbage has not been collected in my area.';
      const routing = routeGrievanceText(query);

      expect(routing.outcomeKind).toBe('NEEDS_INFORMATION');
      expect(routing.recommendedEntity).toBeNull();
      expect(routing.clarification).toBeDefined();
      expect(routing.clarification?.type).toBe('LOCATION');
      // Officer must be undefined when information is needed
      expect(routing.nodalOfficer).toBeUndefined();
    });

    it('Scenario 6: Missing Officer -> Gracefully handles non-existent authority without breaking routing', () => {
      const result = findNodalOfficer('Non Existent Galactic Authority');

      expect(result.isAvailable).toBe(false);
      expect(result.officer).toBeNull();
      expect(result.matchType).toBe('NONE');
      expect(result.unavailableMessage).toBe(
        'Official CPGRAMS nodal officer information not available for this authority.'
      );
    });

    it('handles empty, null, and undefined authority queries safely', () => {
      expect(findNodalOfficer(null).isAvailable).toBe(false);
      expect(findNodalOfficer(undefined).isAvailable).toBe(false);
      expect(findNodalOfficer('').isAvailable).toBe(false);
      expect(findNodalOfficer('   ').isAvailable).toBe(false);
    });
  });

  describe('Alias & Fuzzy Authority Normalization', () => {
    it('matches shortcodes and ministry aliases like Railways, CBDT, MeitY, Power', () => {
      expect(findNodalOfficer('Railway Board').officer?.organisation).toBe('Railways, ( Railway Board)');
      expect(findNodalOfficer('CBDT').officer?.organisation).toBe('Central Board of Direct Taxes (Income Tax)');
      expect(findNodalOfficer('Ministry of Power').officer?.organisation).toBe('Power');
      expect(findNodalOfficer('MeitY').officer?.organisation).toBe('Electronics & Information Technology');
      expect(findNodalOfficer('EPFO').officer?.organisation).toBe('Labour and Employment');
    });

    it('normalizes organisation names consistently removing punctuation and extra whitespace', () => {
      expect(normalizeOrgName('Financial Services (Banking Division)')).toBe('financial services banking division');
      expect(normalizeOrgName('Health &amp; Family Welfare')).toBe('health & family welfare');
    });

    it('resolves municipal corporations to their respective state nodal escalation cells', () => {
      const pcmcMatch = findNodalOfficer('Pimpri Chinchwad Municipal Corporation (PCMC)', {
        jurisdictionLevel: 'LOCAL_MUNICIPAL',
      });
      expect(pcmcMatch.officer?.organisation).toBe('Maharashtra');
      expect(pcmcMatch.matchType).toBe('STATE_ESCALATION');

      const kurnoolMatch = findNodalOfficer('Local Municipal Authority (Kurnool, Andhra Pradesh)', {
        jurisdictionLevel: 'LOCAL_MUNICIPAL',
      });
      expect(kurnoolMatch.officer?.organisation).toBe('Andhra Pradesh');
      expect(kurnoolMatch.matchType).toBe('STATE_ESCALATION');
    });
  });
});
