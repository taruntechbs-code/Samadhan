import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2, Check, Clipboard, FileEdit, Info, Landmark, UserRound, X } from 'lucide-react';
import { RoutingRecommendation } from '../../intelligence/types';
import {
  copyPreparedGrievance,
  continueToOfficialCpgrams,
  prepareGrievance,
} from '../../services/grievancePreparation';
import { useTranslation } from '../../i18n';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface GrievancePreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  routing: RoutingRecommendation | null;
  grievanceText: string;
}

const jurisdictionLabels: Record<NonNullable<RoutingRecommendation['jurisdictionLevel']>, { en: string; hi: string }> = {
  CENTRAL_MINISTRY: { en: 'Central Ministry / Department', hi: 'केंद्रीय मंत्रालय / विभाग' },
  STATE_GOVERNMENT: { en: 'State Government', hi: 'राज्य सरकार' },
  LOCAL_MUNICIPAL: { en: 'Local Urban Local Body', hi: 'स्थानीय नगर निकाय' },
  GENERAL: { en: 'General jurisdiction', hi: 'सामान्य अधिकार क्षेत्र' },
};

export const GrievancePreparationModal: React.FC<GrievancePreparationModalProps> = ({
  isOpen,
  onClose,
  routing,
  grievanceText,
}) => {
  const { language, t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [grievance, setGrievance] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (!isOpen || !routing) return;
    const draft = prepareGrievance({
      grievance: grievanceText,
      detectedCategory: routing.detectedCategory,
      language,
    });
    setSubject(draft.subject);
    setGrievance(draft.grievance);
    setCopyState('idle');
  }, [grievanceText, isOpen, language, routing]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !routing) return null;

  const handleCopy = async () => {
    try {
      await copyPreparedGrievance(subject, grievance);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const handleContinue = () => {
    // The official portal opens synchronously; clipboard permission cannot block it.
    void continueToOfficialCpgrams(subject, grievance).then(copied => {
      setCopyState(copied ? 'copied' : 'failed');
    });
  };

  const jurisdiction = jurisdictionLabels[routing.jurisdictionLevel || 'GENERAL'][language];
  const officer = routing.nodalOfficer;

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grievance-preparation-title"
        onClick={event => event.stopPropagation()}
        style={{ width: '100%', maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto', borderRadius: 'var(--radius-dialog)', boxShadow: 'var(--shadow-level-3)' }}
      >
        <Card variant="standard" style={{ padding: '1.75rem', position: 'relative' }}>
          <button
            type="button"
            className="btn btn-text"
            style={{ position: 'absolute', top: '14px', right: '14px', padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
            onClick={onClose}
            aria-label={t('preparationModal.close')}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Badge type="primary" style={{ marginBottom: '0.5rem' }}>
                <FileEdit size={14} />
                <span>{t('preparationModal.badge')}</span>
              </Badge>
              <h2 id="grievance-preparation-title" className="headline-medium" style={{ fontSize: '1.4rem', color: 'var(--md-sys-color-on-surface)' }}>
                {t('preparationModal.title')}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', marginTop: '0.25rem' }}>
                {t('preparationModal.subtitle')}
              </p>
            </div>

            <div style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--civic-warning-bg)', border: '1px solid var(--civic-warning-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Info size={18} style={{ color: 'var(--civic-warning-text)', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ color: 'var(--civic-warning-text)', fontSize: '0.8125rem', lineHeight: 1.45 }}>
                <strong>{t('preparationModal.notSubmitted')}</strong> {t('preparationModal.boundaryNotice')}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', borderRadius: 'var(--radius-card)', padding: '0.875rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Building2 size={20} style={{ flexShrink: 0 }} />
                <div><small>{t('preparationModal.authority')}</small><div style={{ fontWeight: 700 }}>{routing.recommendedEntity}</div></div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Landmark size={20} style={{ flexShrink: 0 }} />
                <div><small>{t('preparationModal.jurisdiction')}</small><div style={{ fontWeight: 700 }}>{jurisdiction}</div></div>
              </div>
              <div><small>{t('preparationModal.category')}</small><div style={{ fontWeight: 700 }}>{routing.detectedCategory}</div></div>
              {officer && (
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <UserRound size={20} style={{ flexShrink: 0 }} />
                  <div><small>{t('preparationModal.nodalOfficer')}</small><div style={{ fontWeight: 700 }}>{officer.name}</div><div style={{ fontSize: '0.75rem' }}>{officer.designation}</div></div>
                </div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="prepared-subject" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--civic-text-secondary)' }}>
                {t('preparationModal.subject')}
              </label>
              <input id="prepared-subject" className="input-filled" value={subject} onChange={event => { setSubject(event.target.value); setCopyState('idle'); }} />
            </div>

            <div className="input-container">
              <label htmlFor="prepared-grievance" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--civic-text-secondary)' }}>
                {t('preparationModal.grievance')}
              </label>
              <textarea id="prepared-grievance" className="input-filled" rows={8} value={grievance} onChange={event => { setGrievance(event.target.value); setCopyState('idle'); }} style={{ resize: 'vertical', lineHeight: 1.5 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>{t('preparationModal.editHint')}</span>
            </div>

            {copyState !== 'idle' && (
              <div aria-live="polite" style={{ fontSize: '0.78125rem', color: copyState === 'copied' ? 'var(--civic-success)' : 'var(--civic-warning-text)' }}>
                {copyState === 'copied' ? t('preparationModal.copied') : t('preparationModal.copyFailed')}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button type="button" variant="tonal" onClick={() => void handleCopy()}>
                {copyState === 'copied' ? <Check size={16} /> : <Clipboard size={16} />}
                <span>{t('preparationModal.copy')}</span>
              </Button>
              <Button type="button" variant="filled" onClick={handleContinue}>
                <span>{t('preparationModal.continue')}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
