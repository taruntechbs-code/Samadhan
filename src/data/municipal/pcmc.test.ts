/**
 * SAMADHAN — Municipal Case Study Adapter Unit Tests (PCMC)
 * Validates strict dataset isolation, category resolution, and non-pollution of national metrics.
 */

import { describe, it, expect } from 'vitest';
import { getMunicipalCaseStudy, PCMC_2025_CASE_STUDY } from './pcmc';
import { DATASET_REGISTRY } from '../datasetRegistry';

describe('Municipal Case Study Adapter (PCMC)', () => {
  it('should return valid PCMC municipal case study structure', () => {
    const study = getMunicipalCaseStudy();
    expect(study.corporation).toContain('Pimpri Chinchwad');
    expect(study.state).toBe('Maharashtra');
    expect(study.year).toBe(2025);
    expect(study.totalGrievances).toBe(48920);
    expect(study.resolvedGrievances).toBe(44280);
    expect(study.disposalRate).toBe(90.51);
    expect(study.categories.length).toBe(5);
  });

  it('should have municipal category metrics with average resolution times', () => {
    const water = PCMC_2025_CASE_STUDY.categories.find(c => c.category.includes('Water'));
    expect(water).toBeDefined();
    expect(water?.disposalRate).toBeGreaterThan(90);
    expect(water?.avgResolutionDays).toBeLessThan(10);
  });

  it('should enforce strict dataset isolation and distinct provenance category', () => {
    const study = getMunicipalCaseStudy();
    expect(study.dataSource.category).toBe('MUNICIPAL_CASE_STUDY');
    expect(study.disclaimer).toContain('strictly segregated');
    expect(DATASET_REGISTRY.pcmcMunicipalCaseStudy.id).toBe('pcmc_grievance_2025');
  });
});
