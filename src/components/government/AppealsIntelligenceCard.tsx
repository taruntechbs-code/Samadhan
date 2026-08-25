import React from 'react';
import { Card } from '../common/Card';
import { AppealsOverview } from '../../services/types';
import { FileQuestion, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';

interface AppealsIntelligenceCardProps {
  appeals: AppealsOverview;
  onSelectDepartment?: (entity: string) => void;
}

export const AppealsIntelligenceCard: React.FC<AppealsIntelligenceCardProps> = ({
  appeals,
  onSelectDepartment,
}) => {
  const { t } = useTranslation();

  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--md-sys-color-tertiary-container)',
              color: 'var(--md-sys-color-on-tertiary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileQuestion size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.2rem' }}>
              {t('appealsCard.title')}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('appealsCard.subtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--md-sys-color-risk-low)', fontSize: '0.8125rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>{appeals.appealDisposalRate}% {t('appealsCard.disposalVelocity')}</span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{t('appealsCard.received')}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-on-surface)', marginTop: '0.25rem' }}>
            {appeals.appealsReceived.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{t('appealsCard.disposed')}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-risk-low)', marginTop: '0.25rem' }}>
            {appeals.appealsDisposed.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{t('appealsCard.pending')}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-risk-medium)', marginTop: '0.25rem' }}>
            {appeals.appealsPending.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Top Departments with Appeals */}
      <div style={{ marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('appealsCard.topHandling')}
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {(appeals.departmentAppeals || []).slice(0, 6).map((dept, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                  {dept.entity}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {dept.received.toLocaleString('en-IN')} appeals ({dept.pending.toLocaleString('en-IN')} {t('appealsCard.pendAbbrev')})
                </div>
              </div>

              {onSelectDepartment && (
                <Button
                  variant="text"
                  style={{ padding: '0.25rem 0.5rem', minHeight: 'auto', fontSize: '0.75rem' }}
                  onClick={() => onSelectDepartment(dept.entity)}
                >
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
