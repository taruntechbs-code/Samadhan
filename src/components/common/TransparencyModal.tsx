import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { SystemMetadata } from '../../intelligence/types';
import { fetchSystemMetadata } from '../../services/apiClient';
import { DATASET_REGISTRY } from '../../data/datasetRegistry';
import { useTranslation } from '../../i18n';
import { ShieldCheck, Database, AlertCircle, Cpu, X } from 'lucide-react';

export interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();
  const [meta, setMeta] = useState<SystemMetadata | null>(null);

  useEffect(() => {
    if (isOpen && !meta) {
      fetchSystemMetadata().then(setMeta).catch(console.error);
    }
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, meta, onClose]);

  if (!isOpen) return null;

  const datasetList = Object.values(DATASET_REGISTRY);

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
          maxWidth: '840px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-dialog)',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--civic-border-medium)',
        }}
      >
        <div style={{ padding: '1.75rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-text"
            style={{ position: 'absolute', top: '14px', right: '14px', padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                {language === 'hi' ? 'विश्वास, डेटा एवं कार्यप्रणाली' : 'TRUST & DATA METHODOLOGY'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                SAMADHAN Architecture Provenance
              </span>
            </div>
            <h2 className="headline-medium" style={{ fontSize: '1.35rem', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'डेटा स्रोत वंशावली एवं प्रज्ञान सिद्धांत' : 'Dataset Provenance, Lineage & Intelligence Architecture'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              {language === 'hi'
                ? 'डेटा स्रोतों, वर्गीकरण मॉडल, जोखिम सूत्र और प्रोटोटाइप सीमाओं का पूर्ण सार्वजनिक प्रकटीकरण।'
                : 'Full public disclosure of official datasets, routing models, deterministic risk formulas, and prototype boundaries.'}
            </p>
          </div>

          {/* 1. Official Dataset Registries */}
          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
              <Database size={17} />
              <span>1. Verified Public Datasets & Data.gov.in Provenance</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5 }}>
              SAMADHAN consumes real aggregate datasets published by the Department of Administrative Reforms and Public Grievances (DARPG), Open Government Data (Data.gov.in), and the National Health Authority (NHA).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.875rem' }}>
              {datasetList.map(ds => (
                <div
                  key={ds.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--civic-border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--civic-text-primary)' }}>
                      {ds.name}
                    </span>
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {ds.category}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span><strong>Publisher:</strong> {ds.publisher}</span>
                    {ds.periodStart && <span><strong>Period:</strong> {ds.periodStart} to {ds.periodEnd || 'Present'}</span>}
                    {ds.recordCount && <span><strong>Records:</strong> {ds.recordCount.toLocaleString('en-IN')}</span>}
                  </div>

                  <p style={{ fontSize: '0.78125rem', color: 'var(--civic-text-secondary)', margin: '0.15rem 0 0 0', lineHeight: 1.45 }}>
                    {ds.description}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--civic-brand)', fontWeight: 600, marginTop: '0.2rem' }}>
                    Usage in SAMADHAN: {ds.usageInSamadhan}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Deterministic Routing Architecture */}
          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
              <Cpu size={17} />
              <span>2. Deterministic Grievance Routing & Responsible AI Principles</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.55 }}>
              The citizen intake engine maps natural language grievance statements to 278 real public authorities using an explainable, regex word-boundary taxonomy model with zero opaque black-box guessing.
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5 }}>
              <li><strong>Zero False Guessing:</strong> When an input lacks departmental identifiers (confidence &lt; 60%), SAMADHAN flags <code>NEEDS_REVIEW</code> rather than fabricating a false authority.</li>
              <li><strong>Facility Isolation:</strong> Healthcare queries query the 200,440-facility National Health Directory server-side to resolve local administrative jurisdiction without polluting central CPGRAMS macro metrics.</li>
              <li><strong>Auditable Lineage:</strong> Every recommendation links directly to DARPG entity records.</li>
            </ul>
          </div>

          {/* 3. Deterministic Risk Scoring Formula */}
          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={17} />
              <span>3. Explainable Risk Scoring Formula (0–100 Scale)</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5 }}>
              Operational risk is 100% deterministic and non-accusatory, computed directly from objective metrics:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5 }}>
              <li><strong>Disposal Velocity:</strong> &lt;50% (+45 pts), 50–70% (+35 pts), 70–80% (+25 pts), 80–90% (+15 pts).</li>
              <li><strong>Chronic Pendency (&gt;1 Year):</strong> &gt;10 cases (+35 pts), 1–10 cases (+25 pts).</li>
              <li><strong>High Unresolved Volume:</strong> &gt;10,000 cases (+15 pts), &gt;5,000 cases (+10 pts).</li>
              <li><strong>Aging Concentration:</strong> &gt;30% in 180–365 day queue (+15 pts).</li>
            </ul>
          </div>

          {/* 4. Prototype Boundaries & Security */}
          <div style={{ backgroundColor: 'var(--civic-warning-bg)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--civic-warning-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--civic-warning-text)' }}>
              <AlertCircle size={16} />
              <span>Independent Civic-Tech Architecture Prototype</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--civic-warning-text)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              SAMADHAN is an independent innovation prototype and does NOT claim official Government of India portal authority. All citizen grievance submissions generate demo reference numbers stored in the browser session for workflow demonstration. No citizen submissions are transmitted to real CPGRAMS endpoints without explicit authorization.
            </p>
          </div>

          {/* Close Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <Button variant="filled" onClick={onClose} style={{ minHeight: '38px', fontSize: '0.8125rem' }}>
              <span>{language === 'hi' ? 'समझ गया' : 'Acknowledge & Close'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
