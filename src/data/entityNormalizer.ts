/**
 * SAMADHAN — Deterministic Entity Normalization Layer
 * Maps historical and alternate authority naming variants to canonical CPGRAMS reporting entities.
 * Ensures strict, unambiguous alignment without silent inaccurate merges.
 */

export interface NormalizedEntityResult {
  rawEntity: string;
  canonicalEntity: string;
  isNormalized: boolean;
  matchType: 'EXACT' | 'MAPPED_VARIANT' | 'CANONICAL_ALIAS' | 'UNMAPPED';
}

const CANONICAL_MAPPINGS: Record<string, string> = {
  // Labour & EPFO
  'ministry of labour and employment': 'Labour and Employment',
  'ministry of labour & employment': 'Labour and Employment',
  'labour and employment': 'Labour and Employment',
  'labour & employment': 'Labour and Employment',
  'employees provident fund organisation': 'Labour and Employment',

  // Finance & Taxation
  'central board of direct taxes (income tax)': 'Central Board of Direct Taxes (Income Tax)',
  'central board of direct taxes': 'Central Board of Direct Taxes (Income Tax)',
  'cbdt': 'Central Board of Direct Taxes (Income Tax)',
  'income tax department': 'Central Board of Direct Taxes (Income Tax)',
  'central board of excise and customs': 'Central Board of Excise and Customs',
  'central board of indirect taxes and customs': 'Central Board of Excise and Customs',
  'cbic': 'Central Board of Excise and Customs',
  'financial services (banking division)': 'Financial Services (Banking Division)',
  'department of financial services (banking division)': 'Financial Services (Banking Division)',
  'department of financial services': 'Financial Services (Banking Division)',

  // Communications & Railways
  'department of posts': 'Posts',
  'posts': 'Posts',
  'india post': 'Posts',
  'department of telecommunications': 'Telecommunications',
  'telecommunications': 'Telecommunications',
  'dot': 'Telecommunications',
  'ministry of railways ( railway board)': 'Railway Board',
  'ministry of railways': 'Railway Board',
  'railway board': 'Railway Board',

  // Education
  'department of higher education': 'Higher Education',
  'higher education': 'Higher Education',
  'department of school education and literacy': 'School Education and Literacy',
  'school education and literacy': 'School Education and Literacy',

  // Health & Family Welfare
  'department of health and family welfare': 'Health & Family Welfare',
  'department of health & family welfare': 'Health & Family Welfare',
  'ministry of health and family welfare': 'Health & Family Welfare',
  'health and family welfare': 'Health & Family Welfare',
  'health & family welfare': 'Health & Family Welfare',
  'ministry of ayush': 'Ayush',
  'ayush': 'Ayush',

  // External Affairs & Home
  'ministry of external affairs': 'External Affairs',
  'external affairs': 'External Affairs',
  'ministry of home affairs': 'Home Affairs',
  'home affairs': 'Home Affairs',

  // Agriculture, Power, Petroleum
  'department of agriculture and farmers welfare': 'Department of Agriculture and Farmers Welfare',
  'department of agriculture & farmers welfare': 'Department of Agriculture and Farmers Welfare',
  'agriculture and farmers welfare': 'Department of Agriculture and Farmers Welfare',
  'ministry of power': 'Power',
  'power': 'Power',
  'ministry of petroleum and natural gas': 'Petroleum and Natural Gas',
  'petroleum and natural gas': 'Petroleum and Natural Gas',
  'housing and urban affairs': 'Housing and Urban Affairs',
  'ministry of housing and urban affairs': 'Housing and Urban Affairs',
};

/**
 * Normalizes any entity string to its canonical CPGRAMS reporting name.
 * If no verified mapping exists, returns UNMAPPED without fabricating associations.
 */
export function normalizeEntityName(rawEntity: string): NormalizedEntityResult {
  if (!rawEntity || typeof rawEntity !== 'string') {
    return {
      rawEntity: '',
      canonicalEntity: 'Unknown Entity',
      isNormalized: false,
      matchType: 'UNMAPPED',
    };
  }

  const trimmed = rawEntity.trim();
  const lower = trimmed.toLowerCase();

  // Check exact canonical dictionary
  if (CANONICAL_MAPPINGS[lower]) {
    const canonical = CANONICAL_MAPPINGS[lower];
    const isExact = canonical.toLowerCase() === lower;
    return {
      rawEntity: trimmed,
      canonicalEntity: canonical,
      isNormalized: !isExact,
      matchType: isExact ? 'EXACT' : 'MAPPED_VARIANT',
    };
  }

  // Strip standard prefixes (e.g. "Department of ", "Ministry of ")
  const stripped = lower
    .replace(/^ministry of\s+/i, '')
    .replace(/^department of\s+/i, '')
    .replace(/^o\/o the\s+/i, '')
    .trim();

  if (CANONICAL_MAPPINGS[stripped]) {
    return {
      rawEntity: trimmed,
      canonicalEntity: CANONICAL_MAPPINGS[stripped],
      isNormalized: true,
      matchType: 'CANONICAL_ALIAS',
    };
  }

  // Unmapped entity - return as-is with UNMAPPED flag
  return {
    rawEntity: trimmed,
    canonicalEntity: trimmed,
    isNormalized: false,
    matchType: 'UNMAPPED',
  };
}

/**
 * Compares two entity names for canonical semantic equivalence.
 */
export function areEntitiesEquivalent(entityA: string, entityB: string): boolean {
  if (!entityA || !entityB) return false;
  const normA = normalizeEntityName(entityA);
  const normB = normalizeEntityName(entityB);
  return normA.canonicalEntity.toLowerCase() === normB.canonicalEntity.toLowerCase();
}
