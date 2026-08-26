/**
 * SAMADHAN — Evidence Viewer Modal
 * Inspects parsed document evidence, detected entities, reference IDs, and highlighted RAG passages.
 */

import React from 'react';
import { Button } from '../common/Button';
import { ExtractedDocument, analyzeDocument } from '../../intelligence';
import { useTranslation } from '../../i18n';
import {
  FileText,
  Trash2,
  X,
  Sparkles,
  Calendar,
  CreditCard,
  Building2,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export interface EvidenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: ExtractedDocument[];
  onRemoveDocument: (id: string) => void;
  grievanceQuery?: string;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  isOpen,
  onClose,
  documents,
  onRemoveDocument,
  grievanceQuery,
}) => {
  const { language } = useTranslation();
  const [selectedDocId, setSelectedDocId] = React.useState<string>(documents[0]?.id || '');

  React.useEffect(() => {
    if (documents.length > 0 && (!selectedDocId || !documents.some(d => d.id === selectedDocId))) {
      setSelectedDocId(documents[0].id);
    }
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [documents, selectedDocId, isOpen, onClose]);

  if (!isOpen || documents.length === 0) return null;

  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const analysis = currentDoc ? analyzeDocument(currentDoc, grievanceQuery) : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-dialog)',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--civic-border-medium)',
        }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--civic-border-light)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--civic-brand-light)',
                  color: 'var(--civic-brand-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileCheck size={18} />
              </div>
              <div>
                <h3 className="title-large" style={{ fontSize: '1.15rem', color: 'var(--civic-text-primary)', margin: 0 }}>
                  {language === 'hi' ? 'दस्तावेज़ साक्ष्य विश्लेषण' : 'Document Evidence Intelligence'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                  {documents.length} {language === 'hi' ? 'संलग्न फ़ाइलें' : 'attached file(s) analyzed'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-text"
              style={{ minHeight: 'auto', padding: '0.4rem', borderRadius: '50%' }}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>

          {/* Document Selector Tabs */}
          {documents.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {documents.map(d => (
                <button
                  key={d.id}
                  type="button"
                  className="btn"
                  style={{
                    minHeight: '32px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedDocId === d.id ? 'var(--civic-brand)' : 'var(--civic-canvas-subtle)',
                    color: selectedDocId === d.id ? '#FFFFFF' : 'var(--civic-text-secondary)',
                    border: '1px solid var(--civic-border-medium)',
                  }}
                  onClick={() => setSelectedDocId(d.id)}
                >
                  <FileText size={13} />
                  <span>{d.sanitizedName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Document Details */}
          {currentDoc && analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* File Meta Header */}
              <div
                style={{
                  backgroundColor: 'var(--civic-canvas-subtle)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--civic-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--civic-text-primary)' }}>
                      {currentDoc.sanitizedName}
                    </span>
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {currentDoc.extension.toUpperCase()} &bull; {(currentDoc.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                    {analysis.entities.confidence !== 'LOW' && (
                      <span className="chip chip-primary" style={{ fontSize: '0.6875rem' }}>
                        {analysis.entities.domain}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', marginTop: '0.2rem' }}>
                    {analysis.entities.summary}
                  </div>
                </div>

                <Button
                  variant="tonal"
                  style={{ minHeight: '32px', padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--civic-danger)' }}
                  onClick={() => {
                    onRemoveDocument(currentDoc.id);
                    if (documents.length <= 1) onClose();
                  }}
                >
                  <Trash2 size={13} />
                  <span>{language === 'hi' ? 'फ़ाइल हटाएं' : 'Remove File'}</span>
                </Button>
              </div>

              {/* Detected Entities Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {/* Reference Numbers */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--civic-brand)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CreditCard size={14} />
                    <span>{language === 'hi' ? 'पहचान एवं संदर्भ संख्या' : 'Reference & IDs'}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--civic-text-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                    {analysis.entities.referenceNumbers.length > 0
                      ? analysis.entities.referenceNumbers.join(', ')
                      : language === 'hi' ? 'कोई विशिष्ट आईडी नहीं मिली' : 'None detected'}
                  </div>
                </div>

                {/* Dates */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--civic-brand)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Calendar size={14} />
                    <span>{language === 'hi' ? 'महत्वपूर्ण तिथियाँ' : 'Dates Detected'}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--civic-text-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                    {analysis.entities.dates.length > 0
                      ? analysis.entities.dates.join(', ')
                      : language === 'hi' ? 'कोई विशिष्ट तिथि नहीं' : 'None detected'}
                  </div>
                </div>

                {/* Suggested Authority */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--civic-brand)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Building2 size={14} />
                    <span>{language === 'hi' ? 'संबंधित प्राधिकरण' : 'Likely Authority'}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--civic-text-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                    {analysis.entities.suggestedAuthority}
                  </div>
                </div>
              </div>

              {/* RAG Retrieved Passages Section */}
              <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.875rem' }}>
                    <Sparkles size={16} />
                    <span>{language === 'hi' ? 'शिकायत के संदर्भ में प्रासंगिक अंश (RAG)' : 'Relevant Evidence Passages (RAG Retrieval)'}</span>
                  </div>
                  {analysis.retrieval && (
                    <span className={analysis.retrieval.isRelevant ? 'chip chip-low' : 'chip chip-secondary'} style={{ fontSize: '0.6875rem' }}>
                      {analysis.retrieval.isRelevant ? 'Relevant to Grievance' : 'General Background'}
                    </span>
                  )}
                </div>

                {analysis.retrieval && analysis.retrieval.matchedPassages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {analysis.retrieval.matchedPassages.map((match, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '0.875rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--civic-border-light)',
                          borderLeft: '4px solid var(--civic-brand)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7125rem', color: 'var(--civic-text-muted)', marginBottom: '0.35rem' }}>
                          <span>Section #{match.chunk.chunkIndex}</span>
                          <span>Relevance Score: {Math.round(match.relevanceScore * 100)}%</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-primary)', lineHeight: 1.5, margin: 0 }}>
                          &ldquo;{match.chunk.text}&rdquo;
                        </p>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--civic-brand)', fontWeight: 600, marginTop: '0.35rem' }}>
                          Matched keywords: {match.matchedKeywords.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-muted)', margin: 0 }}>
                    {currentDoc.extractionNote || 'No specific keyword matches found between this document and your current grievance text.'}
                  </p>
                )}
              </div>

              {/* Privacy Notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--civic-text-muted)', borderTop: '1px solid var(--civic-border-light)', paddingTop: '0.75rem' }}>
                <AlertCircle size={14} style={{ color: 'var(--civic-brand)', flexShrink: 0 }} />
                <span>
                  {language === 'hi'
                    ? 'आपकी साक्ष्य फ़ाइल केवल इस शिकायत के वर्गीकरण में सहायता के लिए ब्राउज़र सत्र में उपयोग की जाती है।'
                    : 'Your evidence is used only to assist this grievance analysis. It is not treated as official government data.'}
                </span>
              </div>
            </div>
          )}

          {/* Footer Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
            <Button variant="filled" onClick={onClose} style={{ minHeight: '36px', fontSize: '0.8125rem' }}>
              <span>{language === 'hi' ? 'बंद करें' : 'Close Viewer'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
