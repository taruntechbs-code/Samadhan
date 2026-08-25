/**
 * SAMADHAN — Historical Intelligence Engine Unit Tests
 * Validates baseline computation, delta variance, trend classification, and system overview aggregation.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseCpgramsCsv } from './csvLoader';
import { CpgramsService, initializeCpgramsService } from '../services/cpgramsService';
import {
  getDepartmentHistoricalComparison,
  getAllHistoricalComparisons,
  getHistoricalSystemOverview,
} from './cpgramsHistorical';

describe('Historical Intelligence Engine', () => {
  let service: CpgramsService;

  beforeAll(() => {
    const csvPath = path.resolve(process.cwd(), '10_MASTER_verified_cpgrams_metrics_long.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const parseResult = parseCpgramsCsv(csvContent);
    service = initializeCpgramsService(parseResult.normalizedRows);
  });

  it('should calculate historical baseline and trend for central departments with history', () => {
    const profile = getDepartmentHistoricalComparison('Labour and Employment', service);
    expect(profile).not.toBeNull();
    expect(profile?.entity).toBe('Labour and Employment');
    expect(profile?.hasHistoricalBaseline).toBe(true);
    expect(profile?.historicalDisposalRate).toBeGreaterThan(0);
    expect(profile?.currentDisposalRate).toBeGreaterThan(0);
    expect(profile?.varianceDisposalRate).toBeDefined();
    expect(['IMPROVING', 'STABLE', 'DETERIORATING']).toContain(profile?.trend);
    expect(profile?.evidence.length).toBeGreaterThanOrEqual(2);
  });

  it('should normalize entity variants when querying historical baselines', () => {
    const profile = getDepartmentHistoricalComparison('Ministry of Labour and Employment', service);
    expect(profile).not.toBeNull();
    expect(profile?.entity).toBe('Labour and Employment');
    expect(profile?.hasHistoricalBaseline).toBe(true);
  });

  it('should handle entities with insufficient historical records gracefully', () => {
    const comparisons = getAllHistoricalComparisons(service);
    const withoutHistory = comparisons.filter(c => !c.hasHistoricalBaseline);
    expect(withoutHistory.length).toBeGreaterThanOrEqual(0);
    if (withoutHistory.length > 0) {
      expect(withoutHistory[0].trend).toBe('INSUFFICIENT_HISTORY');
    }
  });

  it('should compute executive longitudinal overview metrics', () => {
    const overview = getHistoricalSystemOverview(service);
    expect(overview.totalEntitiesTracked).toBeGreaterThan(0);
    expect(overview.totalEntitiesWithHistory).toBeGreaterThan(0);
    expect(overview.overallHistoricalDisposalRate).toBeGreaterThan(0);
    expect(overview.overallCurrentDisposalRate).toBeGreaterThan(0);
    expect(overview.topImprovingEntities.length).toBeGreaterThan(0);
    expect(overview.topDeterioratingEntities.length).toBeGreaterThan(0);
    expect(overview.evidence.length).toBeGreaterThanOrEqual(2);
  });
});
