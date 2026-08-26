/**
 * SAMADHAN — Document Intelligence & Multi-Document Reasoning Engine
 * Extracts domain categories, public authority entities, reference IDs, dates, and geographic locations.
 * Performs multi-document evidence aggregation without hallucinations or data leakage.
 */

import { ExtractedDocument } from './documentParser';
import { retrieveRelevantChunks, DocumentRetrievalResult } from './documentRag';

export interface DocumentEntityExtracts {
  domain: string;
  suggestedAuthority: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  referenceNumbers: string[];
  dates: string[];
  amounts: string[];
  locations: string[];
  healthFacilityQuery?: string;
  evidenceKeywords: string[];
  summary: string;
}

export interface DocumentAnalysisResult {
  documentId: string;
  documentName: string;
  extension: string;
  extractionStatus: 'SUCCESS' | 'IMAGE_UNSUPPORTED' | 'FAILED';
  entities: DocumentEntityExtracts;
  retrieval?: DocumentRetrievalResult;
}

export interface MultiDocumentEvidence {
  totalAnalyzed: number;
  relevantDocumentsCount: number;
  convergedDomain: string | null;
  convergedAuthority: string | null;
  hasConvergence: boolean;
  hasContradiction: boolean;
  convergenceExplanation: string;
  extractedKeywords: string[];
  facilityLocationQuery?: string;
  documentResults: DocumentAnalysisResult[];
}

const DOMAIN_PATTERNS = [
  {
    domain: 'Income Tax & Direct Taxation',
    authority: 'Central Board of Direct Taxes (Income Tax)',
    keywords: ['income tax', 'itr', 'refund', 'tds', 'pan card', 'assessment year', 'form 16', 'direct tax', 'challan', 'आयकर', 'रिफंड', 'टैक्स'],
  },
  {
    domain: 'Labour, EPFO & Pensions',
    authority: 'Labour and Employment',
    keywords: ['epfo', 'provident fund', 'pension', 'uan', 'gratuity', 'pf transfer', 'esic', 'member passbook', 'ईपीएफओ', 'भविष्य निधि', 'पेंशन'],
  },
  {
    domain: 'Healthcare & Public Health Facilities',
    authority: 'Health & Family Welfare',
    keywords: ['phc', 'chc', 'hospital', 'health center', 'ayushman', 'medicine', 'doctor', 'clinic', 'rural hospital', 'स्वास्थ्य', 'अस्पताल', 'दवा'],
  },
  {
    domain: 'Railways & Train Services',
    authority: 'Railway Board',
    keywords: ['railway', 'irctc', 'train', 'tatkal', 'pnr', 'berth', 'station', 'refund', 'rail ticket', 'रेलवे', 'ट्रेन', 'तत्काल', 'टिकट'],
  },
  {
    domain: 'Banking & Financial Services',
    authority: 'Financial Services (Banking Division)',
    keywords: ['bank', 'atm', 'savings account', 'upi', 'loan', 'credit card', 'debit card', 'transaction failed', 'बैंक', 'खाता', 'एटीएम'],
  },
  {
    domain: 'Postal & Delivery Services',
    authority: 'Posts',
    keywords: ['speed post', 'post office', 'parcel', 'consignment', 'dak', 'tracking number', 'डाकघर', 'पार्सल', 'स्पीड पोस्ट'],
  },
  {
    domain: 'External Affairs & Passport',
    authority: 'External Affairs',
    keywords: ['passport', 'visa', 'embassy', 'consulate', 'police verification', 'rpo', 'पासपोर्ट', 'वीजा'],
  },
];

/**
 * Analyzes a single document for entities, reference IDs, and domain indicators.
 */
export function analyzeDocument(doc: ExtractedDocument, grievanceQuery?: string): DocumentAnalysisResult {
  if (doc.extractionStatus !== 'SUCCESS' || !doc.extractedText) {
    return {
      documentId: doc.id,
      documentName: doc.originalName,
      extension: doc.extension,
      extractionStatus: doc.extractionStatus,
      entities: {
        domain: 'Uncategorized',
        suggestedAuthority: 'Unknown',
        confidence: 'LOW',
        referenceNumbers: [],
        dates: [],
        amounts: [],
        locations: [],
        evidenceKeywords: [],
        summary: doc.extractionNote || 'Document text not extracted.',
      },
    };
  }

  const text = doc.extractedText;
  const lower = text.toLowerCase();

  // 1. Detect Domain & Suggested Authority
  let bestDomain = 'General Civic Documentation';
  let bestAuthority = 'Department of Administrative Reforms and Public Grievances';
  let maxKeywordMatches = 0;
  let detectedKeywords: string[] = [];

  for (const rule of DOMAIN_PATTERNS) {
    const matched = rule.keywords.filter(kw => lower.includes(kw.toLowerCase()));
    if (matched.length > maxKeywordMatches) {
      maxKeywordMatches = matched.length;
      bestDomain = rule.domain;
      bestAuthority = rule.authority;
      detectedKeywords = matched;
    }
  }

  const confidence: DocumentEntityExtracts['confidence'] =
    maxKeywordMatches >= 3 ? 'HIGH' : maxKeywordMatches >= 1 ? 'MEDIUM' : 'LOW';

  // 2. Extract Reference IDs (PAN, PNR, UAN, etc.)
  const refMatches: string[] = [];
  // PAN: 5 letters, 4 digits, 1 letter
  const panMatches = text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g);
  if (panMatches) refMatches.push(...panMatches.map(p => `PAN: ${p}`));

  // PNR: 10 digits
  const pnrMatches = text.match(/\bPNR[\s:-]*([0-9]{10})\b/i);
  if (pnrMatches) refMatches.push(`PNR: ${pnrMatches[1]}`);

  // UAN: 12 digits
  const uanMatches = text.match(/\bUAN[\s:-]*([0-9]{12})\b/i);
  if (uanMatches) refMatches.push(`UAN: ${uanMatches[1]}`);

  // Assessment Year
  const ayMatches = text.match(/\b(?:AY|Assessment Year)[\s:-]*([0-9]{4}-[0-9]{2,4})\b/i);
  if (ayMatches) refMatches.push(`AY: ${ayMatches[1]}`);

  // 3. Extract Dates (DD/MM/YYYY, DD Month YYYY, YYYY-MM-DD)
  const dateRegex = /\b(?:\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}|\d{4}-\d{2}-\d{2})\b/gi;
  const rawDates = text.match(dateRegex) || [];
  const uniqueDates = Array.from(new Set(rawDates)).slice(0, 3);

  // 4. Extract Monetary Amounts (₹, Rs., INR)
  const amountRegex = /(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{2})?)/gi;
  const rawAmounts = text.match(amountRegex) || [];
  const uniqueAmounts = Array.from(new Set(rawAmounts)).slice(0, 3);

  // 5. Extract Locations & Healthcare Facility Context
  const locationTerms = ['Adoni', 'Kurnool', 'Andhra Pradesh', 'Pune', 'Pimpri', 'Lucknow', 'Delhi', 'Mumbai', 'Patna', 'Bhopal', 'Hyderabad', 'Bengaluru'];
  const matchedLocations = locationTerms.filter(loc => new RegExp(`\\b${loc}\\b`, 'i').test(text));

  let healthFacilityQuery: string | undefined = undefined;
  if (bestDomain.includes('Healthcare') || lower.includes('phc') || lower.includes('chc') || lower.includes('hospital')) {
    const phcMatch = text.match(/\b(PHC\s+[A-Za-z]+(?:\s+[A-Za-z]+)?|CHC\s+[A-Za-z]+|Hospital\s+[A-Za-z]+)/i);
    if (phcMatch) {
      healthFacilityQuery = `${phcMatch[1]} ${matchedLocations.join(' ')}`.trim();
    } else if (matchedLocations.length > 0) {
      healthFacilityQuery = `PHC ${matchedLocations.join(' ')}`.trim();
    }
  }

  // 6. RAG Retrieval if grievance text query is supplied
  let retrievalResult: DocumentRetrievalResult | undefined = undefined;
  if (grievanceQuery && grievanceQuery.trim().length > 0) {
    retrievalResult = retrieveRelevantChunks(grievanceQuery, doc);
  }

  const entities: DocumentEntityExtracts = {
    domain: bestDomain,
    suggestedAuthority: bestAuthority,
    confidence,
    referenceNumbers: Array.from(new Set(refMatches)),
    dates: uniqueDates,
    amounts: uniqueAmounts,
    locations: matchedLocations,
    healthFacilityQuery,
    evidenceKeywords: detectedKeywords,
    summary:
      maxKeywordMatches > 0
        ? `Detected domain '${bestDomain}' (${confidence} confidence) with keywords [${detectedKeywords.join(', ')}].`
        : 'Document contains general content without specific department keywords.',
  };

  return {
    documentId: doc.id,
    documentName: doc.originalName,
    extension: doc.extension,
    extractionStatus: doc.extractionStatus,
    entities,
    retrieval: retrievalResult,
  };
}

/**
 * Aggregates findings across multiple documents to identify convergence or contradictions.
 */
export function aggregateMultiDocumentEvidence(
  documents: ExtractedDocument[],
  grievanceQuery?: string
): MultiDocumentEvidence {
  if (documents.length === 0) {
    return {
      totalAnalyzed: 0,
      relevantDocumentsCount: 0,
      convergedDomain: null,
      convergedAuthority: null,
      hasConvergence: false,
      hasContradiction: false,
      convergenceExplanation: 'No evidence documents attached.',
      extractedKeywords: [],
      documentResults: [],
    };
  }

  const results = documents.map(d => analyzeDocument(d, grievanceQuery));
  const relevantDocs = results.filter(r => r.retrieval?.isRelevant ?? (r.entities.confidence !== 'LOW'));

  const domainFrequency = new Map<string, number>();
  const authorityFrequency = new Map<string, number>();
  const allKeywords = new Set<string>();
  let facilityLocationQuery: string | undefined = undefined;

  for (const res of results) {
    if (res.extractionStatus === 'SUCCESS') {
      const dom = res.entities.domain;
      const auth = res.entities.suggestedAuthority;
      if (dom !== 'General Civic Documentation' && dom !== 'Uncategorized') {
        domainFrequency.set(dom, (domainFrequency.get(dom) || 0) + 1);
        authorityFrequency.set(auth, (authorityFrequency.get(auth) || 0) + 1);
      }
      res.entities.evidenceKeywords.forEach(k => allKeywords.add(k));
      if (res.entities.healthFacilityQuery && !facilityLocationQuery) {
        facilityLocationQuery = res.entities.healthFacilityQuery;
      }
    }
  }

  // Check convergence & contradictions
  let convergedDomain: string | null = null;
  let convergedAuthority: string | null = null;
  let hasConvergence = false;
  let hasContradiction = false;
  let explanation = '';

  const distinctDomains = Array.from(domainFrequency.keys());

  if (distinctDomains.length === 1) {
    convergedDomain = distinctDomains[0];
    convergedAuthority = Array.from(authorityFrequency.keys())[0] || null;
    hasConvergence = true;
    explanation = `${results.length} document(s) consistently support the '${convergedDomain}' classification.`;
  } else if (distinctDomains.length > 1) {
    // Multiple distinct domains found across documents
    hasContradiction = true;
    explanation = `Conflicting domains detected across uploaded evidence (${distinctDomains.join(' vs ')}).`;
  } else {
    explanation = 'Attached documents provide background context without strong departmental keywords.';
  }

  return {
    totalAnalyzed: documents.length,
    relevantDocumentsCount: relevantDocs.length,
    convergedDomain,
    convergedAuthority,
    hasConvergence,
    hasContradiction,
    convergenceExplanation: explanation,
    extractedKeywords: Array.from(allKeywords),
    facilityLocationQuery,
    documentResults: results,
  };
}
