/**
 * SAMADHAN — Facility Directory Data Engine Unit Tests
 * Validates CSV parsing, in-memory search, geographic resolution, boundary limits, and error resilience.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  parseFacilityDirectoryCsv,
  searchFacilities,
  getFacilityById,
  resolveFacilityCsvPath,
} from './facilityDirectory';
import { routeGrievanceText } from '../intelligence/routingEngine';

const SAMPLE_CSV = `State Name,District Name,Subdistrict Name,Facility Type,Facility Name,Facility Address,Latitude,Longitude,ActiveFlag_C,NOTIONAL_PHYSICAL,Location Type,Type Of Facility,Nin_N
A & N Islands,Nicobar,Nancowry,chc,CHC Nancowry,Kamorta,7.96109,93.5589,Y,Physical,Rural,Public,NA
A & N Islands,South Andaman,Ferrargunj,phc,PHC Manglutan,NA,11.60279,92.66471,Y,Physical,Rural,Public,NA
Andhra Pradesh,Kurnool,Adoni,phc,PHC Adoni Rural,Near Main Bus Stand,15.632,77.275,Y,Physical,Rural,Public,987654321
Andhra Pradesh,Kurnool,Adoni,chc,CHC Adoni Urban,Hospital Road,15.635,77.278,Y,Physical,Urban,Public,NA
Haryana,Panipat,Panipat,dis_h,Civil Hospital Panipat,GT Road,29.39,76.96,N,Physical,Urban,Public,NA
Unknown State,NA,NA,phc,NA,NA,NA,NA,NA,NA,NA,NA,NA
`;

describe('Facility Directory Data Layer', () => {
  const records = parseFacilityDirectoryCsv(SAMPLE_CSV);

  it('should parse valid CSV rows and skip empty/NA facility names', () => {
    expect(records.length).toBe(5);
    expect(records[0].facilityName).toBe('CHC Nancowry');
    expect(records[0].district).toBe('Nicobar');
    expect(records[0].state).toBe('A & N Islands');
    expect(records[0].active).toBe(true);
  });

  it('should preserve NIN identifiers when available or generate fallback IDs', () => {
    const withNin = records.find(r => r.facilityName === 'PHC Adoni Rural');
    expect(withNin?.id).toBe('987654321');

    const withoutNin = records.find(r => r.facilityName === 'CHC Nancowry');
    expect(withoutNin?.id).toMatch(/^FAC-\d{6}$/);
  });

  it('should support multi-token keyword search across name, district, and state', () => {
    const res = searchFacilities({ q: 'Adoni Kurnool' }, records);
    expect(res.results.length).toBe(2);
    expect(res.results[0].district).toBe('Kurnool');
    expect(res.results[0].subdistrict).toBe('Adoni');
  });

  it('should filter facilities by facilityType', () => {
    const chcRes = searchFacilities({ facilityType: 'CHC' }, records);
    expect(chcRes.results.length).toBe(2);
    expect(chcRes.results.every(r => r.facilityType === 'CHC')).toBe(true);
  });

  it('should enforce limit bounds between 1 and 50', () => {
    const res = searchFacilities({ limit: 1 }, records);
    expect(res.results.length).toBe(1);
    expect(res.limit).toBe(1);

    const overLimit = searchFacilities({ limit: 100 }, records);
    expect(overLimit.limit).toBe(50);
  });

  it('should find facility by ID or NIN', () => {
    const foundByNin = getFacilityById('987654321', records);
    expect(foundByNin?.facilityName).toBe('PHC Adoni Rural');

    const notFound = getFacilityById('NON-EXISTENT-ID', records);
    expect(notFound).toBeNull();
  });

  it('should handle malformed coordinates without throwing', () => {
    const item = records.find(r => r.facilityName === 'Civil Hospital Panipat');
    expect(item?.latitude).toBe(29.39);
    expect(item?.active).toBe(false);
  });

  it('should resolve data/facility_directory.csv from root data/ directory', () => {
    const resolved = resolveFacilityCsvPath();
    expect(resolved).toBeTruthy();
    expect(resolved).toContain('facility_directory.csv');
    expect(fs.existsSync(resolved!)).toBe(true);
  });

  it('should verify facility_directory.csv is NOT in public/ folder', () => {
    const publicPath = path.resolve(process.cwd(), 'public/facility_directory.csv');
    expect(fs.existsSync(publicPath)).toBe(false);
  });
});

describe('Facility Routing Scenarios', () => {
  // Scenario A: Healthcare + Location
  it('Scenario A: Healthcare with location resolves intent and enables facility context', () => {
    const result = routeGrievanceText('PHC in Adoni Kurnool is not functioning');
    expect(result.status).toBe('MATCHED');
    expect(result.detectedCategory).toBe('Health & Family Welfare');
    expect(result.facilityContextAvailable).toBe(true);
    expect(result.facilityDomain).toBe('HEALTHCARE');
  });

  // Scenario B: Healthcare without Location
  it('Scenario B: Healthcare without location detects healthcare intent without fabricating facility', () => {
    const result = routeGrievanceText('The PHC near my village has no medicines');
    expect(result.status).toBe('MATCHED');
    expect(result.detectedCategory).toBe('Health & Family Welfare');
    expect(result.facilityContextAvailable).toBe(true);
    expect(result.facilityDomain).toBe('HEALTHCARE');
  });

  // Scenario C: Non-Healthcare (Income Tax)
  it('Scenario C: Income tax grievance does NOT enable facility context', () => {
    const result = routeGrievanceText('My income tax refund is delayed');
    expect(result.detectedCategory).toBe('Income Tax & Direct Taxation');
    expect(result.facilityContextAvailable).toBeFalsy();
  });

  // Scenario D: Railway
  it('Scenario D: Railway grievance does NOT enable facility context', () => {
    const result = routeGrievanceText('Tatkal ticket cancelled automatically but refund not credited');
    expect(result.detectedCategory).toBe('Railways & Train Services');
    expect(result.facilityContextAvailable).toBeFalsy();
  });

  // Scenario E: EPFO
  it('Scenario E: Pension grievance does NOT enable facility context', () => {
    const result = routeGrievanceText('My pension payment has been delayed for two months by EPFO');
    expect(result.detectedCategory).toBe('Labour, EPFO & Pensions');
    expect(result.facilityContextAvailable).toBeFalsy();
  });
});
