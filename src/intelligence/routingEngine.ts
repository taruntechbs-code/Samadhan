/**
 * SAMADHAN — Citizen Grievance Routing Engine (Prototype)
 * Transparent, explainable keyword-and-category routing to dataset-verified public authorities.
 */

import { RoutingRecommendation, CandidateEntityMatch, RoutingStatus } from './types';

interface RoutingCategoryRule {
  category: string;
  keywords: string[];
  primaryEntity: string;
  alternatives: string[];
  explanation: string;
}

const ROUTING_RULES: RoutingCategoryRule[] = [
  {
    category: 'Banking & Financial Services',
    keywords: ['bank', 'banking', 'atm', 'loan', 'credit card', 'debit card', 'upi', 'financial fraud', 'savings account', 'cheque', 'emi', 'net banking', 'interest rate', 'fixed deposit', 'chargeback'],
    primaryEntity: 'Financial Services (Banking Division)',
    alternatives: ['Central Board of Direct Taxes (Income Tax)', 'Economic Affairs'],
    explanation: 'Keywords match banking transactions, ATM failures, loan disputes, or electronic payments.',
  },
  {
    category: 'Income Tax & Direct Taxation',
    keywords: ['income tax', 'tax', 'it return', 'itr', 'pan card', 'refund', 'tds', 'tax assessment', 'form 16', 'direct tax', 'advance tax', 'challan'],
    primaryEntity: 'Central Board of Direct Taxes (Income Tax)',
    alternatives: ['Central Board of Indirect Taxes and Customs', 'Revenue'],
    explanation: 'Keywords match direct taxation, income tax return filing, PAN cards, or tax refunds.',
  },
  {
    category: 'GST & Indirect Taxes / Customs',
    keywords: ['gst', 'customs', 'cgst', 'igst', 'sgst', 'excise', 'import duty', 'export duty', 'cargo clearance', 'tariff', 'tax invoice'],
    primaryEntity: 'Central Board of Indirect Taxes and Customs',
    alternatives: ['Central Board of Direct Taxes (Income Tax)', 'Commerce'],
    explanation: 'Keywords match indirect taxes, GST registration, tax credits, or customs clearance.',
  },
  {
    category: 'Railways & Train Services',
    keywords: ['railway', 'train', 'irctc', 'pnr', 'berth', 'coach', 'station', 'tatkal', 'ticket', 'locomotive', 'rail ticket', 'platform', 'train cancellation'],
    primaryEntity: 'Railway Board',
    alternatives: ['Road Transport and Highways'],
    explanation: 'Keywords match Indian Railways ticketing, coach maintenance, station facilities, or passenger amenities.',
  },
  {
    category: 'Telecommunications & Broadband',
    keywords: ['telecom', 'sim card', 'broadband', 'bsnl', 'mtnl', 'mobile network', 'call drop', 'spectrum', '4g', '5g', 'telephone', 'tower', 'fiber'],
    primaryEntity: 'Telecommunications',
    alternatives: ['Electronics & Information Technology', 'Posts'],
    explanation: 'Keywords match telecom networks, mobile connectivity, ISP services, or BSNL/MTNL infrastructure.',
  },
  {
    category: 'Postal & Delivery Services',
    keywords: ['post office', 'speed post', 'parcel', 'dak', 'pin code', 'registered post', 'postal order', 'money order', 'india post'],
    primaryEntity: 'Posts',
    alternatives: ['Telecommunications'],
    explanation: 'Keywords match India Post mail delivery, parcel tracking, savings bank, or speed post services.',
  },
  {
    category: 'Labour, EPFO & Pensions',
    keywords: ['epfo', 'provident fund', 'pension', 'gratuity', 'salary', 'unpaid wage', 'labour welfare', 'esic', 'workplace dispute', 'uan number', 'pf transfer', 'retirement benefit'],
    primaryEntity: 'Labour and Employment',
    alternatives: ['Personnel, Public Grievances and Pensions', 'Financial Services (Banking Division)'],
    explanation: 'Keywords match employee provident fund (EPFO), ESIC healthcare, pensions, or labour welfare.',
  },
  {
    category: 'External Affairs, Passport & Visa',
    keywords: ['passport', 'visa', 'embassy', 'consulate', 'nri', 'overseas', 'mea', 'emigration', 'foreign travel', 'passport seva'],
    primaryEntity: 'External Affairs',
    alternatives: ['Home Affairs'],
    explanation: 'Keywords match Passport Seva Kendra operations, visa facilitation, embassy assistance, or consular support.',
  },
  {
    category: 'Road Transport & National Highways',
    keywords: ['highway', 'toll plaza', 'fastag', 'driving licence', 'driving license', 'national highway', 'nhai', 'vahan', 'sarathi', 'pothole', 'road safety'],
    primaryEntity: 'Road Transport and Highways',
    alternatives: ['Railway Board'],
    explanation: 'Keywords match national highways, Fastag toll plaza operations, driving licences, or Vahan registrations.',
  },
  {
    category: 'Education & Academic Institutions',
    keywords: ['school', 'college', 'university', 'ugc', 'cbse', 'exam fee', 'student scholarship', 'neet', 'jee', 'degree certificate', 'college admission', 'aicte'],
    primaryEntity: 'Higher Education',
    alternatives: ['School Education and Literacy'],
    explanation: 'Keywords match university administration, higher educational institutions, entrance examinations, or degrees.',
  },
  {
    category: 'Health & Family Welfare',
    keywords: [
      'hospital',
      'doctor',
      'medicine supply',
      'aiims',
      'medical treatment',
      'vaccine',
      'health center',
      'health centre',
      'clinic',
      'ayushman',
      'cghs',
      'medical negligence',
      'phc',
      'chc',
      'primary health centre',
      'primary health center',
      'community health centre',
      'community health center',
      'dispensary',
      'sub centre',
      'subcenter',
      'uhc',
      'civil hospital',
      'district hospital',
      'ambulance',
      'अस्पताल',
      'स्वास्थ्य केंद्र',
      'पीएचसी',
      'सीएचसी',
    ],
    primaryEntity: 'Health & Family Welfare',
    alternatives: ['Ayush', 'Pharmaceuticals'],
    explanation: 'Keywords match public healthcare centers, PHCs, CHCs, hospitals, medicine availability, or healthcare schemes.',
  },
  {
    category: 'Ayush & Traditional Medicine',
    keywords: ['ayurveda', 'ayush', 'homeopathy', 'unani', 'siddha', 'yoga certification', 'naturopathy', 'herbal medicine'],
    primaryEntity: 'Ayush',
    alternatives: ['Health & Family Welfare'],
    explanation: 'Keywords match traditional healthcare systems including Ayurveda, Yoga, Unani, Siddha, and Homeopathy.',
  },
  {
    category: 'Housing & Urban Affairs',
    keywords: ['builder fraud', 'rera', 'pradhan mantri awas', 'pmay', 'municipality', 'urban housing', 'slum redevelopment', 'smart city', 'property handover'],
    primaryEntity: 'Housing and Urban Affairs',
    alternatives: ['Rural Development'],
    explanation: 'Keywords match urban development, housing schemes (PMAY-U), RERA regulations, or smart city projects.',
  },
  {
    category: 'Agriculture & Farmers Welfare',
    keywords: ['farmer', 'crop loss', 'kisan', 'pm kisan', 'fertilizer subsidy', 'seed quality', 'msp payment', 'agriculture loan', 'drought relief', 'soil health'],
    primaryEntity: 'Department of Agriculture and Farmers Welfare',
    alternatives: ['Chemicals and Petrochemicals', 'Rural Development'],
    explanation: 'Keywords match agricultural subsidies, PM-Kisan DBT transfers, crop compensation, or farming inputs.',
  },
  {
    category: 'Power & Energy Distribution',
    keywords: ['electricity', 'power cut', 'electric meter', 'bijli', 'voltage fluctuation', 'discom', 'power substation', 'transformer issue', 'power grid', 'smart meter'],
    primaryEntity: 'Power',
    alternatives: ['New and Renewable Energy'],
    explanation: 'Keywords match electrical power grid, transmission lines, smart metering, or electricity supply disputes.',
  },
  {
    category: 'Petroleum & Cooking Gas',
    keywords: ['lpg cylinder', 'petrol pump', 'diesel supply', 'cng filling', 'indane gas', 'bharat gas', 'hp gas', 'gas pipeline', 'gas agency', 'ujjwala', 'gas subsidy'],
    primaryEntity: 'Petroleum and Natural Gas',
    alternatives: ['Power'],
    explanation: 'Keywords match LPG cylinder distribution (Indane, HP, Bharat Gas), fuel pump operations, or Ujjwala Yojana.',
  },
];

const ROUTING_DISCLAIMER =
  'Prototype routing — not an official CPGRAMS routing decision. Final grievance allocation is subject to administrative review.';

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
}

/**
 * Routes raw citizen grievance text to candidate public authority entities.
 */
export function routeGrievanceText(queryText: string): RoutingRecommendation {
  if (!queryText || typeof queryText !== 'string' || queryText.trim() === '') {
    return {
      queryText: '',
      status: 'UNCATEGORIZED',
      detectedCategory: 'Unclassified',
      recommendedEntity: null,
      confidence: 0,
      matchReason: 'No grievance query text was provided.',
      alternativeCandidates: [],
      disclaimer: ROUTING_DISCLAIMER,
    };
  }

  const sanitized = queryText.slice(0, 2000);
  const normalized = sanitized.toLowerCase().trim();

  let bestMatch: RoutingCategoryRule | null = null;
  let bestScore = 0;
  const matchScores: Array<{ rule: RoutingCategoryRule; score: number; matchedKeywords: string[] }> = [];

  for (const rule of ROUTING_RULES) {
    let ruleScore = 0;
    const matched: string[] = [];

    for (const kw of rule.keywords) {
      if (matchesKeyword(normalized, kw)) {
        const weight = kw.includes(' ') ? 3 : 1;
        ruleScore += weight;
        matched.push(kw);
      }
    }

    if (ruleScore > 0) {
      matchScores.push({ rule, score: ruleScore, matchedKeywords: matched });
      if (ruleScore > bestScore) {
        bestScore = ruleScore;
        bestMatch = rule;
      }
    }
  }

  if (!bestMatch || bestScore === 0) {
    return {
      queryText,
      status: 'UNCATEGORIZED',
      detectedCategory: 'General Administrative / Uncategorized',
      recommendedEntity: null,
      confidence: 0,
      matchReason: 'No specific departmental keywords detected in grievance text.',
      alternativeCandidates: [],
      disclaimer: ROUTING_DISCLAIMER,
    };
  }

  // Calibration: Minimum 0.55 up to 0.95 based on keyword richness
  const rawConfidence = Math.min(0.55 + bestScore * 0.12, 0.95);
  const confidence = Number(rawConfidence.toFixed(2));
  const status: RoutingStatus = confidence >= 0.5 ? 'MATCHED' : 'NEEDS_REVIEW';

  const alternatives: CandidateEntityMatch[] = [];
  
  for (const alt of bestMatch.alternatives) {
    alternatives.push({
      entity: alt,
      confidence: Number((confidence * 0.7).toFixed(2)),
      reason: `Related jurisdiction in ${bestMatch.category} category.`,
    });
  }

  const sortedRunners = matchScores
    .filter(m => m.rule.category !== bestMatch!.category)
    .sort((a, b) => b.score - a.score);

  for (const runner of sortedRunners.slice(0, 2)) {
    alternatives.push({
      entity: runner.rule.primaryEntity,
      confidence: Number((confidence * 0.5).toFixed(2)),
      reason: `Secondary match on keywords: ${runner.matchedKeywords.join(', ')}`,
    });
  }

  const primaryMatchInfo = matchScores.find(m => m.rule.category === bestMatch!.category);
  const matchedKwStr = primaryMatchInfo?.matchedKeywords.join(', ') || 'relevant topics';

  const isHealthcare =
    bestMatch.category === 'Health & Family Welfare' ||
    bestMatch.category === 'Ayush & Traditional Medicine';

  return {
    queryText,
    status,
    detectedCategory: bestMatch.category,
    recommendedEntity: bestMatch.primaryEntity,
    confidence,
    matchReason: `Detected keywords (${matchedKwStr}) matching ${bestMatch.category}: ${bestMatch.explanation}`,
    alternativeCandidates: alternatives,
    disclaimer: ROUTING_DISCLAIMER,
    facilityContextAvailable: isHealthcare,
    facilityDomain: isHealthcare ? 'HEALTHCARE' : 'GENERAL',
    extractedFacilityQuery: isHealthcare ? queryText : undefined,
  };
}
