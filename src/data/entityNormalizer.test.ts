/**
 * SAMADHAN — Entity Normalizer Unit Tests
 * Validates deterministic canonical mapping, aliases, and unmapped preservation.
 */

import { describe, it, expect } from 'vitest';
import { normalizeEntityName, areEntitiesEquivalent } from './entityNormalizer';

describe('Entity Normalizer', () => {
  it('should map Ministry variants to canonical entity names', () => {
    const result1 = normalizeEntityName('Ministry of Labour and Employment');
    expect(result1.canonicalEntity).toBe('Labour and Employment');
    expect(result1.matchType).toBe('MAPPED_VARIANT');

    const result2 = normalizeEntityName('Labour & Employment');
    expect(result2.canonicalEntity).toBe('Labour and Employment');

    const result3 = normalizeEntityName('Department of Posts');
    expect(result3.canonicalEntity).toBe('Posts');
  });

  it('should preserve canonical names without changes', () => {
    const result = normalizeEntityName('Labour and Employment');
    expect(result.canonicalEntity).toBe('Labour and Employment');
    expect(result.matchType).toBe('EXACT');
  });

  it('should handle prefix stripping for department aliases', () => {
    const result = normalizeEntityName('Department of Telecommunications');
    expect(result.canonicalEntity).toBe('Telecommunications');
  });

  it('should flag unknown entities as UNMAPPED without fabricating associations', () => {
    const result = normalizeEntityName('Random Nonexistent Corporation');
    expect(result.canonicalEntity).toBe('Random Nonexistent Corporation');
    expect(result.matchType).toBe('UNMAPPED');
    expect(result.isNormalized).toBe(false);
  });

  it('should accurately compare semantic equivalence', () => {
    expect(areEntitiesEquivalent('Ministry of Railways', 'Railway Board')).toBe(true);
    expect(areEntitiesEquivalent('CBDT', 'Central Board of Direct Taxes (Income Tax)')).toBe(true);
    expect(areEntitiesEquivalent('Ministry of Power', 'Power')).toBe(true);
    expect(areEntitiesEquivalent('Posts', 'Railways')).toBe(false);
  });
});
