import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { SystemMetadata } from '../../intelligence/types';
import { fetchSystemMetadata } from '../../services/apiClient';
import { ShieldCheck, Database, AlertCircle, Cpu, X } from 'lucide-react';

export interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({ isOpen, onClose }) => {
  const [meta, setMeta] = useState<SystemMetadata | null>(null);

  useEffect(() => {
    if (isOpen && !meta) {
      fetchSystemMetadata().then(setMeta).catch(console.error);
    }
  }, [isOpen, meta]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-dialog)',
          boxShadow: 'var(--shadow-level-3)',
        }}
      >
        <Card variant="standard" style={{ padding: '2rem', position: 'relative' }}>
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-text"
            style={{ position: 'absolute', top: '18px', right: '18px', padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Badge type="primary">
                  <ShieldCheck size={14} />
                  <span>Trust, Transparency &amp; Methodology</span>
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Build What Moves India 2026
                </span>
              </div>
              <h2 className="headline-medium" style={{ fontSize: '1.5rem', color: 'var(--md-sys-color-on-surface)' }}>
                SAMADHAN Data Lineage &amp; Intelligence Principles
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                Full disclosure of datasets, algorithms, and prototype boundaries.
              </p>
            </div>

            {/* 1. Official Data Foundation */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <Database size={18} />
                <span>1. Verified CPGRAMS Dataset (2,134 Rows &bull; 278 Authorities)</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                SAMADHAN consumes real aggregate telemetry from the Department of Administrative Reforms and Public Grievances (DARPG).
                Data partitions are strictly isolated:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <li><strong>Live Operational Dashboard (2026-01-01 to 2026-08-24)</strong>: 127 tracked entities handling 21,77,902 received cases.</li>
                <li><strong>Appellate Redressal Dashboard (2026-08-25)</strong>: 88 central ministries handling 2,30,602 secondary appeals (93.02% disposal).</li>
                <li><strong>Longitudinal 10-Year History (2016–2026)</strong>: Central &amp; State historical performance trends.</li>
                <li><strong>Monthly Central &amp; State Reports (Jan–Jun 2026)</strong>: Month-by-month progress snapshots.</li>
              </ul>
            </div>

            {/* 2. Routing Intelligence Architecture */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <Cpu size={18} />
                <span>2. Deterministic Grievance Routing (Prototype Disclosure)</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                The citizen routing engine uses an explainable, regex word-boundary taxonomy model mapping 16 major civic domains to 278 real public authorities.
                It returns a calibrated prototype confidence rating and alternative candidates.
                <em> Note: This is an architectural prototype demonstrating citizen-centric routing without pretending to run an opaque black-box model.</em>
              </p>
            </div>

            {/* 3. Deterministic Risk Scoring Formula */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <ShieldCheck size={18} />
                <span>3. Explainable Risk Engine &amp; Non-Accusatory Tone</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                Risk scoring is 100% deterministic (0–100 scale) based on objective operational thresholds:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <li><strong>Disposal Velocity</strong>: &lt;50% (+45 pts), 50–70% (+35 pts), 70–80% (+25 pts), 80–90% (+15 pts).</li>
                <li><strong>Chronic Pendency (&gt;1 Year)</strong>: &gt;10 cases (+35 pts), 1–10 cases (+25 pts).</li>
                <li><strong>Approaching 1-Year (180–365 Days)</strong>: &gt;100 cases (+20 pts), 20–100 cases (+10 pts).</li>
                <li><strong>Operational Backlog Strain</strong>: Active pending &gt; 5,000 cases with disposal &lt; 85% (+10 pts).</li>
              </ul>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.5rem' }}>
                All findings use factual, administrative phrasing rather than accusatory or speculative claims.
              </p>
            </div>

            {/* 4. Known Limitations */}
            <div style={{ backgroundColor: 'var(--md-sys-color-risk-medium-container)', padding: '1rem 1.25rem', borderRadius: '14px', color: 'var(--md-sys-color-on-risk-medium-container)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                <span>Demonstration &amp; Dataset Boundaries</span>
              </div>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.45 }}>
                Grievance submissions generated in this application (SAM-2026-XXXX) are recorded in local demo storage and are not transmitted to the live production CPGRAMS central server without official administrative API credentials.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="filled" onClick={onClose}>
                <span>I Understand &bull; Return to Platform</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
