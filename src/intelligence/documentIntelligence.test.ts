/**
 * SAMADHAN — Phase 10 Automated Test Suite
 * Validates Browser Speech-to-Text abstraction, Document Text Extraction (PDF, DOCX, TXT, CSV),
 * RAG Passage Retrieval, Multi-Document Intelligence, and Document-Assisted Routing Enrichment.
 */

import { describe, it, expect } from 'vitest';
import {
  validateFile,
  sanitizeFileName,
  extractTextFromTxt,
  extractTextFromCsv,
  extractTextFromPdf,
  extractTextFromDocx,
  parseDocument,
  MAX_FILE_SIZE_BYTES,
} from './documentParser';
import {
  chunkDocumentText,
  retrieveRelevantChunks,
} from './documentRag';
import {
  analyzeDocument,
  aggregateMultiDocumentEvidence,
} from './documentIntelligence';
import { routeGrievanceText } from './routingEngine';
import { BrowserSpeechRecognitionProvider } from '../services/speechService';

describe('Phase 10: Speech Recognition Provider', () => {
  it('instantiates provider without throwing and reports support status', () => {
    const provider = new BrowserSpeechRecognitionProvider();
    expect(typeof provider.isSupported).toBe('function');
    expect(typeof provider.isListening).toBe('function');
    expect(provider.isListening()).toBe(false);
  });

  it('handles unsupported environment gracefully without crashing', () => {
    const provider = new BrowserSpeechRecognitionProvider();
    let errorCalled = false;
    let errorMessage = '';

    provider.start({
      onError: err => {
        errorCalled = true;
        errorMessage = err.message;
      },
    });

    if (!provider.isSupported()) {
      expect(errorCalled).toBe(true);
      expect(errorMessage).toContain('Voice input is not supported');
    }
  });
});

describe('Phase 10: Document Ingestion & File Validation', () => {
  it('validates supported extensions (.pdf, .docx, .txt, .csv, .jpg, .png)', () => {
    expect(validateFile('tax_notice.pdf', 1024).valid).toBe(true);
    expect(validateFile('bank_statement.docx', 2048).valid).toBe(true);
    expect(validateFile('grievance.txt', 512).valid).toBe(true);
    expect(validateFile('transactions.csv', 1024).valid).toBe(true);
    expect(validateFile('hospital_bill.jpg', 4096).valid).toBe(true);
    expect(validateFile('screenshot.png', 4096).valid).toBe(true);
  });

  it('rejects unsupported extensions and executables', () => {
    const exe = validateFile('malicious.exe', 1024);
    expect(exe.valid).toBe(false);
    expect(exe.error).toContain('Unsupported file extension');

    const sh = validateFile('script.sh', 512);
    expect(sh.valid).toBe(false);
  });

  it('rejects empty (0 byte) files and oversized files (> 10MB)', () => {
    const empty = validateFile('empty.txt', 0);
    expect(empty.valid).toBe(false);
    expect(empty.error).toContain('empty');

    const oversized = validateFile('huge.pdf', MAX_FILE_SIZE_BYTES + 1024);
    expect(oversized.valid).toBe(false);
    expect(oversized.error).toContain('exceeds the 10 MB limit');
  });

  it('sanitizes malicious filenames and prevents path traversal', () => {
    expect(sanitizeFileName('../../etc/passwd.txt')).toBe('passwd.txt');
    expect(sanitizeFileName('..\\..\\windows\\system32.pdf')).toBe('system32.pdf');
    expect(sanitizeFileName('tax<invoice>:2026?.pdf')).toBe('tax_invoice_2026_.pdf');
  });
});

describe('Phase 10: Document Text Extraction Pipeline', () => {
  it('extracts UTF-8 plain text from TXT', () => {
    const raw = 'Income tax refund delayed for Assessment Year 2025-26. PAN: ABCDE1234F.';
    const extracted = extractTextFromTxt(raw);
    expect(extracted).toContain('Income tax refund');
    expect(extracted).toContain('ABCDE1234F');
  });

  it('extracts structured cells from CSV', () => {
    const csv = 'Date,Transaction,Amount,Status\n2026-03-14,Tatkal Railway Ticket,₹4500,Refund Pending';
    const extracted = extractTextFromCsv(csv);
    expect(extracted).toContain('Tatkal Railway Ticket | ₹4500 | Refund Pending');
  });

  it('extracts text from PDF stream tokens', () => {
    const pdfSim = 'BT /F1 12 Tf (EPFO Pension payment delay) Tj ET BT (UAN: 100987654321) Tj ET';
    const extracted = extractTextFromPdf(new TextEncoder().encode(pdfSim));
    expect(extracted).toContain('EPFO Pension payment delay');
    expect(extracted).toContain('UAN: 100987654321');
  });

  it('extracts text from DOCX XML tags', () => {
    const docxSim = '<w:p><w:r><w:t>Healthcare PHC Adoni Rural Kurnool</w:t></w:r></w:p>';
    const extracted = extractTextFromDocx(new TextEncoder().encode(docxSim));
    expect(extracted).toContain('Healthcare PHC Adoni Rural Kurnool');
  });

  it('reports honest non-OCR message for image files', () => {
    const imgDoc = parseDocument('medical_receipt.jpg', new Uint8Array([0xff, 0xd8, 0xff]), 1024);
    expect(imgDoc.extractionStatus).toBe('IMAGE_UNSUPPORTED');
    expect(imgDoc.extractedText).toBe('');
    expect(imgDoc.extractionNote).toContain('Text extraction is unavailable for image files');
  });
});

describe('Phase 10: RAG Chunking & Retrieval Engine', () => {
  it('chunks documents into logical segments and extracts keywords', () => {
    const doc = parseDocument(
      'income_tax_intimation.txt',
      'Income Tax Department Intimation under Section 143(1).\n\nRefund of ₹18,500 approved on 14 March 2026.\n\nBank account validation failed for State Bank of India.'
    );
    const chunks = chunkDocumentText(doc);
    expect(chunks.length).toBe(3);
    expect(chunks[0].tokens).toContain('income');
    expect(chunks[0].tokens).toContain('tax');
  });

  it('retrieves relevant chunks matching grievance query', () => {
    const doc = parseDocument(
      'refund_notice.txt',
      'Income Tax Department Intimation.\n\nRefund of ₹18,500 issued but failed due to bank account validation error.\n\nContact jurisdictional assessing officer.'
    );
    const retrieval = retrieveRelevantChunks('My income tax refund failed due to bank validation', doc);
    expect(retrieval.isRelevant).toBe(true);
    expect(retrieval.maxScore).toBeGreaterThan(0.2);
    expect(retrieval.matchedPassages[0].snippet).toContain('bank account validation');
  });

  it('rejects irrelevant documents with score below threshold', () => {
    const trainTicket = parseDocument(
      'irctc_ticket.txt',
      'Indian Railways E-Ticket. PNR: 2847192841. Train: 12951 Mumbai Rajdhani. Coach: B2 Berth: 45.'
    );
    const retrieval = retrieveRelevantChunks('My income tax refund is delayed for 6 months', trainTicket);
    expect(retrieval.isRelevant).toBe(false);
    expect(retrieval.extractedEvidenceSummary).toContain('Document does not appear relevant');
  });
});

describe('Phase 10: Document Intelligence & Entity Extraction', () => {
  it('extracts PAN, AY, monetary amounts, and dates from tax notice', () => {
    const doc = parseDocument(
      'itr_intimation.txt',
      'Government of India - Income Tax Department. PAN: ABCDE1234F. Assessment Year 2025-26. Refund amount ₹18,500 processed on 14/03/2026.'
    );
    const analysis = analyzeDocument(doc, 'tax refund delay');
    expect(analysis.entities.domain).toBe('Income Tax & Direct Taxation');
    expect(analysis.entities.suggestedAuthority).toBe('Central Board of Direct Taxes (Income Tax)');
    expect(analysis.entities.referenceNumbers).toContain('PAN: ABCDE1234F');
    expect(analysis.entities.referenceNumbers).toContain('AY: 2025-26');
    expect(analysis.entities.amounts).toContain('₹18,500');
    expect(analysis.entities.confidence).toBe('HIGH');
  });

  it('extracts UAN and EPFO domain from PF document', () => {
    const doc = parseDocument(
      'epfo_passbook.txt',
      'Employees Provident Fund Organisation. UAN: 100987654321. Monthly pension contribution pending.'
    );
    const analysis = analyzeDocument(doc, 'pension delay');
    expect(analysis.entities.domain).toBe('Labour, EPFO & Pensions');
    expect(analysis.entities.suggestedAuthority).toBe('Labour and Employment');
    expect(analysis.entities.referenceNumbers).toContain('UAN: 100987654321');
  });

  it('aggregates multi-document evidence convergence', () => {
    const doc1 = parseDocument('itr.txt', 'Income Tax Return PAN: ABCDE1234F AY 2025-26');
    const doc2 = parseDocument('refund_note.txt', 'Income Tax refund intimation failed');
    const multi = aggregateMultiDocumentEvidence([doc1, doc2], 'refund pending');

    expect(multi.totalAnalyzed).toBe(2);
    expect(multi.hasConvergence).toBe(true);
    expect(multi.hasContradiction).toBe(false);
    expect(multi.convergedDomain).toBe('Income Tax & Direct Taxation');
    expect(multi.convergenceExplanation).toContain('2 document(s) consistently support');
  });

  it('detects contradictions when documents belong to conflicting domains', () => {
    const doc1 = parseDocument('tax.txt', 'Income tax refund intimation');
    const doc2 = parseDocument('rail.txt', 'Railway train IRCTC tatkal ticket cancellation');
    const multi = aggregateMultiDocumentEvidence([doc1, doc2], 'refund issue');

    expect(multi.totalAnalyzed).toBe(2);
    expect(multi.hasContradiction).toBe(true);
    expect(multi.convergenceExplanation).toContain('Conflicting domains detected');
  });
});

describe('Phase 10: Document-Assisted Routing Enrichment', () => {
  it('Scenario A: Voice / Plain text routing works deterministically', () => {
    const rec = routeGrievanceText('My income tax refund has been delayed for six months after e-verification.');
    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    expect(rec.confidence).toBeGreaterThan(0.7);
  });

  it('Scenario B: Document evidence strengthens ambiguous brief query', () => {
    const doc = parseDocument(
      'refund_intimation.txt',
      'Income Tax Department. PAN: ABCDE1234F. Refund processing issue.'
    );
    const rec = routeGrievanceText('My refund has not arrived.', [doc]);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    expect(rec.matchReason).toContain('Document evidence strengthened the Income Tax & Direct Taxation classification');
    expect(rec.documentEvidence).toBeDefined();
    expect(rec.documentEvidence?.totalAnalyzed).toBe(1);
  });

  it('Scenario C: Healthcare document enriches geographic facility resolution', () => {
    const doc = parseDocument(
      'phc_notice.txt',
      'Primary Health Center PHC Adoni Rural Kurnool Andhra Pradesh medicine supply shortage.'
    );
    const rec = routeGrievanceText('The PHC is not providing medicines.', [doc]);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Health & Family Welfare');
    expect(rec.facilityContextAvailable).toBe(true);
    expect(rec.extractedFacilityQuery).toContain('PHC Adoni Rural');
  });

  it('Scenario D: Irrelevant document does not override primary grievance routing', () => {
    const railwayTicket = parseDocument(
      'irctc_ticket.txt',
      'IRCTC Train Tatkal ticket PNR: 2948192841 cancelled.'
    );
    const rec = routeGrievanceText('My income tax return refund is delayed', [railwayTicket]);

    expect(rec.status).toBe('MATCHED');
    expect(rec.recommendedEntity).toBe('Central Board of Direct Taxes (Income Tax)');
    expect(rec.documentEvidence?.documents[0].isRelevant).toBe(false);
  });

  it('Scenario E: Ambiguous query with ambiguous document remains NEEDS_REVIEW', () => {
    const genericLetter = parseDocument(
      'letter.txt',
      'To whom it may concern. I am writing to express my general dissatisfaction with public services.'
    );
    const rec = routeGrievanceText('I have a problem with a government service and nobody is helping me', [genericLetter]);

    expect(rec.status).toBe('NEEDS_REVIEW');
    expect(rec.recommendedEntity).toBeNull();
    expect(rec.matchReason).toContain('general distress without specific department');
  });
});
