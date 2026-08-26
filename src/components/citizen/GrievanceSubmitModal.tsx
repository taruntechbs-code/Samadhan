import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { RoutingRecommendation } from '../../intelligence/types';
import { saveCitizenGrievance, CitizenGrievanceRecord } from '../../services/apiClient';
import { useTranslation } from '../../i18n';
import { X, CheckCircle, ArrowRight, Building2, FileCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GrievanceSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  routing: RoutingRecommendation | null;
  grievanceText: string;
}

export const GrievanceSubmitModal: React.FC<GrievanceSubmitModalProps> = ({
  isOpen,
  onClose,
  routing,
  grievanceText,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<CitizenGrievanceRecord | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !routing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Please provide your name and mobile number for SMS tracking.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const record = saveCitizenGrievance({
        title: grievanceText.slice(0, 80) + (grievanceText.length > 80 ? '...' : ''),
        description: grievanceText,
        category: routing.detectedCategory,
        routedEntity: routing.recommendedEntity || 'General Redressal Cell',
        applicantName: name,
        mobile,
      });

      setSubmittedRecord(record);
      setIsSubmitting(false);
    }, 600);
  };

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
          maxWidth: '580px',
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

          {!submittedRecord ? (
            /* Submission Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <Badge type="primary" style={{ marginBottom: '0.5rem' }}>
                  <span>{t('submitModal.badge')}</span>
                </Badge>
                <h2 className="headline-medium" style={{ fontSize: '1.4rem', color: 'var(--md-sys-color-on-surface)' }}>
                  {t('submitModal.title')}
                </h2>
              </div>

              {/* Destination Card Summary */}
              <div
                style={{
                  backgroundColor: 'var(--md-sys-color-secondary-container)',
                  borderRadius: 'var(--radius-card)',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                }}
              >
                <Building2 size={24} style={{ color: 'var(--md-sys-color-on-secondary-container)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-secondary-container)', opacity: 0.85 }}>
                    {t('submitModal.destAuthority')}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--md-sys-color-on-secondary-container)', fontSize: '0.95rem' }}>
                    {routing.recommendedEntity}
                  </div>
                </div>
              </div>

              {/* Citizen Details Inputs */}
              <div className="input-container">
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t('submitModal.applicantName')}
                </label>
                <input
                  type="text"
                  required
                  className="input-filled"
                  placeholder={t('submitModal.namePlaceholder')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="input-container">
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t('submitModal.mobileNumber')}
                </label>
                <input
                  type="tel"
                  required
                  className="input-filled"
                  placeholder={t('submitModal.mobilePlaceholder')}
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </div>

              <div className="input-container">
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t('submitModal.location')}
                </label>
                <input
                  type="text"
                  className="input-filled"
                  placeholder={t('submitModal.locationPlaceholder')}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              {/* Prototype Disclosure Notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <Info size={14} style={{ color: 'var(--md-sys-color-primary)', flexShrink: 0 }} />
                <span>{t('submitModal.demoNotice')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <Button type="button" variant="text" onClick={onClose}>
                  {t('submitModal.cancelBtn')}
                </Button>
                <Button type="submit" variant="filled" disabled={isSubmitting}>
                  <span>{isSubmitting ? t('submitModal.submittingBtn') : t('submitModal.submitBtn')}</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--md-sys-color-risk-low-container)',
                  color: 'var(--md-sys-color-risk-low)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={34} />
              </div>

              <div>
                <h2 className="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                  {t('submitModal.successTitle')}
                </h2>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {t('submitModal.successDesc')} <strong>{submittedRecord.routedEntity}</strong>.
                </p>
              </div>

              {/* Reference ID Card */}
              <div
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1.5px dashed var(--md-sys-color-primary)',
                  width: '100%',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('submitModal.refLabel')}
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--md-sys-color-primary)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                  {submittedRecord.id}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="filled"
                  onClick={() => {
                    onClose();
                    navigate(`/track?ref=${submittedRecord.id}`);
                  }}
                >
                  <FileCheck size={16} />
                  <span>{t('submitModal.trackNowBtn')}</span>
                </Button>
                <Button
                  variant="tonal"
                  onClick={() => {
                    onClose();
                    navigate('/grievances');
                  }}
                >
                  <span>{t('submitModal.viewGrievancesBtn')}</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
