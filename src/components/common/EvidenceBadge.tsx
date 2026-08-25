import React, { useState } from 'react';
import { EvidenceReference } from '../../intelligence/types';
import { ShieldCheck, ExternalLink, X, Database } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useTranslation } from '../../i18n';

export interface EvidenceBadgeProps {
  evidence?: EvidenceReference | EvidenceReference[];
  label?: string;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  evidence,
  label,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!evidence) return null;
  const list = Array.isArray(evidence) ? evidence : [evidence];
  if (list.length === 0) return null;

  const displayLabel = label || t('evidence.badgeLabel');

  return (
    <>
      <button
        type="button"
        className={`chip chip-secondary ${className}`}
        style={{
          cursor: 'pointer',
          fontSize: '0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          minHeight: '32px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        title="Click to inspect official dataset source & audit evidence"
      >
        <ShieldCheck size={14} style={{ color: 'var(--md-sys-color-primary)' }} />
        <span>{displayLabel}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '1rem',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '88vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-dialog)',
              boxShadow: 'var(--shadow-level-3)',
            }}
          >
            <Card variant="standard" style={{ padding: '1.75rem', position: 'relative' }}>
              <button
                type="button"
                className="btn btn-text"
                style={{ position: 'absolute', top: '14px', right: '14px', padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
                onClick={() => setIsOpen(false)}
                aria-label="Close evidence dialog"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="title-medium" style={{ fontSize: '1.125rem' }}>
                    {t('evidence.modalTitle')}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {t('evidence.modalSubtitle')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {list.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--md-sys-color-surface-container-low)',
                      borderRadius: '14px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{t('evidence.entity')}</span>
                      <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>{ev.entity}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{t('evidence.metric')}</span>
                      <code>{ev.metric} = {typeof ev.value === 'number' ? ev.value.toLocaleString('en-IN') : ev.value}</code>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{t('evidence.period')}</span>
                      <span>{ev.period}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{t('evidence.dataset')}</span>
                      <code>{ev.dataset}</code>
                    </div>

                    <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid var(--md-sys-color-border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
                        {ev.sourceNote}
                      </div>
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--md-sys-color-primary)',
                          marginTop: '0.4rem',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textDecoration: 'none',
                        }}
                      >
                        <span>{t('evidence.verifyPortal')}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <Button variant="filled" onClick={() => setIsOpen(false)} style={{ minHeight: '38px', padding: '0.4rem 1.25rem' }}>
                  <span>{t('evidence.doneBtn')}</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
