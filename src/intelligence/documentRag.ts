/**
 * SAMADHAN — Explainable Document RAG Retrieval Layer
 * Lightweight, deterministic term-overlap & TF-IDF style passage retriever.
 * Queries citizen grievance text against uploaded evidence chunks to retrieve top relevant passages with zero hallucinations.
 */

import { ExtractedDocument } from './documentParser';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  tokens: string[];
}

export interface RagRetrievalMatch {
  chunk: DocumentChunk;
  relevanceScore: number; // 0.0 to 1.0
  matchedKeywords: string[];
  snippet: string;
}

export interface DocumentRetrievalResult {
  documentId: string;
  documentName: string;
  isRelevant: boolean;
  maxScore: number;
  matchedPassages: RagRetrievalMatch[];
  extractedEvidenceSummary: string;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours',
  'का', 'के', 'की', 'को', 'में', 'पर', 'से', 'है', 'हैं', 'था', 'थे', 'थी', 'यह', 'वह', 'और', 'या', 'तो'
]);

/**
 * Tokenizes text into lowercase normalized alphanumeric keywords excluding stop words.
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

/**
 * Chunks extracted document text into logical paragraphs or bounded 300-character segments.
 */
export function chunkDocumentText(doc: ExtractedDocument, maxChunkSize: number = 350): DocumentChunk[] {
  if (!doc.extractedText || doc.extractedText.trim().length === 0) return [];

  // Split on double linebreaks or paragraph boundaries
  const rawParagraphs = doc.extractedText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 0;

  for (const para of rawParagraphs) {
    if (para.length <= maxChunkSize) {
      const tokens = tokenizeText(para);
      chunks.push({
        id: `${doc.id}_c${chunkCounter++}`,
        documentId: doc.id,
        documentName: doc.originalName,
        chunkIndex: chunkCounter,
        text: para,
        tokenCount: tokens.length,
        tokens,
      });
    } else {
      // Split large paragraphs by sentence lines
      const sentences = para.split(/(?<=[.?!;।\n])\s+/).filter(Boolean);
      let currentBuffer = '';

      for (const sent of sentences) {
        if ((currentBuffer + ' ' + sent).length > maxChunkSize && currentBuffer.length > 0) {
          const tokens = tokenizeText(currentBuffer);
          chunks.push({
            id: `${doc.id}_c${chunkCounter++}`,
            documentId: doc.id,
            documentName: doc.originalName,
            chunkIndex: chunkCounter,
            text: currentBuffer.trim(),
            tokenCount: tokens.length,
            tokens,
          });
          currentBuffer = sent;
        } else {
          currentBuffer = currentBuffer ? `${currentBuffer} ${sent}` : sent;
        }
      }

      if (currentBuffer.trim().length > 0) {
        const tokens = tokenizeText(currentBuffer);
        chunks.push({
          id: `${doc.id}_c${chunkCounter++}`,
          documentId: doc.id,
          documentName: doc.originalName,
          chunkIndex: chunkCounter,
          text: currentBuffer.trim(),
          tokenCount: tokens.length,
          tokens,
        });
      }
    }
  }

  return chunks;
}

/**
 * Evaluates grievance query against all chunks in a document and retrieves top matching evidence.
 */
export function retrieveRelevantChunks(
  grievanceQuery: string,
  doc: ExtractedDocument,
  relevanceThreshold: number = 0.12,
  topK: number = 3
): DocumentRetrievalResult {
  if (doc.extractionStatus !== 'SUCCESS' || !doc.extractedText) {
    return {
      documentId: doc.id,
      documentName: doc.originalName,
      isRelevant: false,
      maxScore: 0,
      matchedPassages: [],
      extractedEvidenceSummary: doc.extractionNote || 'Document text unavailable.',
    };
  }

  const queryTokens = tokenizeText(grievanceQuery);
  const chunks = chunkDocumentText(doc);

  if (queryTokens.length === 0 || chunks.length === 0) {
    return {
      documentId: doc.id,
      documentName: doc.originalName,
      isRelevant: false,
      maxScore: 0,
      matchedPassages: [],
      extractedEvidenceSummary: 'No matching query keywords found in document.',
    };
  }

  const scoredMatches: RagRetrievalMatch[] = [];

  for (const chunk of chunks) {
    const chunkTokenSet = new Set(chunk.tokens);
    const matchedTokens: string[] = [];

    for (const qToken of queryTokens) {
      if (chunkTokenSet.has(qToken)) {
        matchedTokens.push(qToken);
      } else {
        // Substring / partial match for composite terms
        const partial = chunk.tokens.find(ct => ct.includes(qToken) || qToken.includes(ct));
        if (partial) matchedTokens.push(partial);
      }
    }

    if (matchedTokens.length > 0) {
      // Jaccard + Overlap density score
      const overlapScore = matchedTokens.length / Math.sqrt(queryTokens.length * Math.max(chunk.tokens.length, 1));
      const normalizedScore = Math.min(1.0, overlapScore * 1.8);

      if (normalizedScore >= relevanceThreshold) {
        scoredMatches.push({
          chunk,
          relevanceScore: Math.round(normalizedScore * 100) / 100,
          matchedKeywords: Array.from(new Set(matchedTokens)),
          snippet: chunk.text.length > 200 ? `${chunk.text.substring(0, 200)}...` : chunk.text,
        });
      }
    }
  }

  // Sort descending by relevance score
  scoredMatches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const topMatches = scoredMatches.slice(0, topK);

  const maxScore = topMatches.length > 0 ? topMatches[0].relevanceScore : 0;
  const isRelevant = maxScore >= relevanceThreshold;

  let summary = '';
  if (isRelevant && topMatches.length > 0) {
    summary = `Found ${topMatches.length} relevant evidence section(s) matching terms: [${topMatches[0].matchedKeywords.join(', ')}].`;
  } else {
    summary = 'Document does not appear relevant to this grievance.';
  }

  return {
    documentId: doc.id,
    documentName: doc.originalName,
    isRelevant,
    maxScore,
    matchedPassages: topMatches,
    extractedEvidenceSummary: summary,
  };
}
