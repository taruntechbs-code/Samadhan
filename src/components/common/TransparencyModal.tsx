import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { SystemMetadata } from '../../intelligence/types';
import { fetchSystemMetadata } from '../../services/apiClient';
import { useTranslation } from '../../i18n';
import { ShieldCheck, Database, AlertCircle, Cpu, X } from 'lucide-react';

export interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
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
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-dialog)',
          boxShadow: 'var(--shadow-level-3)',
        }}
      >
        <Card variant="standard" style={{ padding: '1.75rem', position: 'relative' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <Badge type="primary">
                  <ShieldCheck size={14} />
                  <span>{t('transparency.badge')}</span>
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t('transparency.eventTag')}
                </span>
              </div>
              <h2 className="headline-medium" style={{ fontSize: '1.4rem', color: 'var(--md-sys-color-on-surface)' }}>
                {t('transparency.title')}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                {t('transparency.subtitle')}
              </p>
            </div>

            {/* 1. Official Data Foundation */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <Database size={18} />
                <span>{t('transparency.sec1Heading')}</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                {t('transparency.sec1Body')}
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <li>{t('transparency.sec1Item1')}</li>
                <li>{t('transparency.sec1Item2')}</li>
                <li>{t('transparency.sec1Item3')}</li>
                <li>{t('transparency.sec1Item4')}</li>
              </ul>
            </div>

            {/* 2. Routing Intelligence Architecture */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <Cpu size={18} />
                <span>{t('transparency.sec2Heading')}</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                {t('transparency.sec2Body')}
              </p>
            </div>

            {/* 3. Deterministic Risk Scoring Formula */}
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                <ShieldCheck size={18} />
                <span>{t('transparency.sec3Heading')}</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', lineHeight: 1.5 }}>
                {t('transparency.sec3Body')}
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <li>{t('transparency.sec3Item1')}</li>
                <li>{t('transparency.sec3Item2')}</li>
                <li>{t('transparency.sec3Item3')}</li>
                <li>{t('transparency.sec3Item4')}</li>
              </ul>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.5rem' }}>
                {t('transparency.sec3Note')}
              </p>
            </div>

            {/* 4. Known Limitations */}
            <div style={{ backgroundColor: 'var(--md-sys-color-risk-medium-container)', padding: '1rem 1.25rem', borderRadius: '14px', color: 'var(--md-sys-color-on-risk-medium-container)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                <span>{t('transparency.sec4Heading')}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.45 }}>
                {t('transparency.sec4Body')}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="filled" onClick={onClose}>
                <span>{t('transparency.understandBtn')}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
