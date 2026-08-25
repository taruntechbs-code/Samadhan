/**
 * SAMADHAN — Public Facility Directory Data Layer
 * Provides high-performance in-memory search and administrative jurisdiction resolution
 * for public healthcare facilities (PHCs, CHCs, District Hospitals, etc.) from the National Facility Directory.
 *
 * Stored securely in `data/facility_directory.csv` and never exposed as a public client asset.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FacilityRecord {
  id: string;
  nin?: string;
  state: string;
  district: string;
  subdistrict: string;
  facilityType: string;
  facilityName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  locationType?: string; // 'Rural' | 'Urban' | string
  typeOfFacility?: string; // 'Public' | 'Private' | string
}

export interface FacilitySearchQuery {
  q?: string;
  state?: string;
  district?: string;
  subdistrict?: string;
  facilityType?: string;
  limit?: number;
}

export interface FacilitySearchResult {
  total: number;
  limit: number;
  results: FacilityRecord[];
}

export const FACILITY_CSV_RELATIVE_PATH = 'data/facility_directory.csv';

// In-memory singleton cache
let cachedFacilities: FacilityRecord[] | null = null;

/**
 * Fast CSV line parser that handles quoted commas and trims whitespace.
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

/**
 * Parses raw CSV content into typed FacilityRecord objects.
 * Safely handles missing fields, coordinate parsing, and empty names.
 */
export function parseFacilityDirectoryCsv(csvContent: string): FacilityRecord[] {
  const lines = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length <= 1) return [];

  const header = parseCsvLine(lines[0]);
  const colIndex: Record<string, number> = {};
  header.forEach((h, idx) => {
    colIndex[h.toLowerCase().trim()] = idx;
  });

  const stateIdx = colIndex['state name'] ?? 0;
  const distIdx = colIndex['district name'] ?? 1;
  const subdistIdx = colIndex['subdistrict name'] ?? 2;
  const facTypeIdx = colIndex['facility type'] ?? 3;
  const facNameIdx = colIndex['facility name'] ?? 4;
  const addrIdx = colIndex['facility address'] ?? 5;
  const latIdx = colIndex['latitude'] ?? 6;
  const lngIdx = colIndex['longitude'] ?? 7;
  const activeIdx = colIndex['activeflag_c'] ?? 8;
  const locTypeIdx = colIndex['location type'] ?? 10;
  const typeOfFacIdx = colIndex['type of facility'] ?? 11;
  const ninIdx = colIndex['nin_n'] ?? 12;

  const records: FacilityRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCsvLine(line);
    const facilityName = row[facNameIdx] || '';
    if (!facilityName || facilityName === 'NA') continue;

    const state = row[stateIdx] || 'Unknown State';
    const district = row[distIdx] || 'Unknown District';
    const subdistrict = row[subdistIdx] || '';
    const facilityType = (row[facTypeIdx] || 'Facility').toUpperCase();
    const address = row[addrIdx] && row[addrIdx] !== 'NA' ? row[addrIdx] : undefined;

    const latRaw = parseFloat(row[latIdx]);
    const lngRaw = parseFloat(row[lngIdx]);
    const latitude = !isNaN(latRaw) && latRaw !== 0 ? latRaw : undefined;
    const longitude = !isNaN(lngRaw) && lngRaw !== 0 ? lngRaw : undefined;

    const active = row[activeIdx] ? row[activeIdx].toUpperCase() === 'Y' : true;
    const locationType = row[locTypeIdx] && row[locTypeIdx] !== 'NA' ? row[locTypeIdx] : undefined;
    const typeOfFacility = row[typeOfFacIdx] && row[typeOfFacIdx] !== 'NA' ? row[typeOfFacIdx] : 'Public';
    const nin = row[ninIdx] && row[ninIdx] !== 'NA' ? row[ninIdx] : undefined;

    const id = nin && nin !== 'NA' ? nin : `FAC-${i.toString().padStart(6, '0')}`;

    records.push({
      id,
      nin,
      state,
      district,
      subdistrict,
      facilityType,
      facilityName,
      address,
      latitude,
      longitude,
      active,
      locationType,
      typeOfFacility,
    });
  }

  return records;
}

/**
 * Resolves the location of data/facility_directory.csv across development, tests, and build environments.
 */
export function resolveFacilityCsvPath(customPath?: string): string | null {
  if (customPath && fs.existsSync(customPath)) return customPath;

  const candidatePaths = [
    path.resolve(process.cwd(), FACILITY_CSV_RELATIVE_PATH),
    path.resolve(__dirname, '../../data/facility_directory.csv'),
    path.resolve(__dirname, '../../../data/facility_directory.csv'),
    path.resolve(__dirname, '../data/facility_directory.csv'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Loads the facility directory from disk (server-side singleton).
 * Parses once and caches in memory.
 */
export function getFacilityDirectory(customPath?: string): FacilityRecord[] {
  if (cachedFacilities) return cachedFacilities;

  const resolvedPath = resolveFacilityCsvPath(customPath);
  if (!resolvedPath) {
    return [];
  }

  const content = fs.readFileSync(resolvedPath, 'utf8');
  cachedFacilities = parseFacilityDirectoryCsv(content);
  return cachedFacilities;
}

/**
 * Clears the in-memory cache (primarily for unit tests).
 */
export function resetFacilityCache(): void {
  cachedFacilities = null;
}

/**
 * Searches the facility directory deterministically with safe boundaries.
 * Bounded to max 50 results.
 */
export function searchFacilities(
  query: FacilitySearchQuery,
  customRecords?: FacilityRecord[]
): FacilitySearchResult {
  const records = customRecords || getFacilityDirectory();
  const rawLimit = Number(query.limit) || 10;
  const limit = Math.min(Math.max(rawLimit, 1), 50);

  const rawQ = query.q || '';
  const q = rawQ.slice(0, 200).trim().toLowerCase();
  const stateFilter = (query.state || '').slice(0, 100).trim().toLowerCase();
  const distFilter = (query.district || '').slice(0, 100).trim().toLowerCase();
  const subdistFilter = (query.subdistrict || '').slice(0, 100).trim().toLowerCase();
  const typeFilter = (query.facilityType || '').slice(0, 50).trim().toUpperCase();

  // Tokenize search query for multi-word matching
  const qTokens = q
    ? q
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.length > 1)
    : [];

  const matched: FacilityRecord[] = [];

  for (const record of records) {
    if (stateFilter && !record.state.toLowerCase().includes(stateFilter)) continue;
    if (distFilter && !record.district.toLowerCase().includes(distFilter)) continue;
    if (subdistFilter && !record.subdistrict.toLowerCase().includes(subdistFilter)) continue;
    if (typeFilter && record.facilityType !== typeFilter) continue;

    if (qTokens.length > 0) {
      const name = record.facilityName.toLowerCase();
      const dist = record.district.toLowerCase();
      const subdist = record.subdistrict.toLowerCase();
      const st = record.state.toLowerCase();
      const type = record.facilityType.toLowerCase();

      // Check if every search token matches anywhere in facility details
      const matchesAll = qTokens.every(
        tok =>
          name.includes(tok) ||
          dist.includes(tok) ||
          subdist.includes(tok) ||
          st.includes(tok) ||
          type.includes(tok)
      );

      if (!matchesAll) continue;
    }

    matched.push(record);
    if (matched.length >= limit * 4) {
      // Early break when sufficient candidates found to avoid unnecessary scans
      break;
    }
  }

  return {
    total: matched.length,
    limit,
    results: matched.slice(0, limit),
  };
}

/**
 * Finds a single facility by ID or NIN.
 */
export function getFacilityById(id: string, customRecords?: FacilityRecord[]): FacilityRecord | null {
  if (!id || typeof id !== 'string') return null;
  const cleanId = id.slice(0, 100).trim().toLowerCase();
  const records = customRecords || getFacilityDirectory();

  const found = records.find(
    r => r.id.toLowerCase() === cleanId || (r.nin && r.nin.toLowerCase() === cleanId)
  );

  return found || null;
}
