import React from 'react';
import { Card } from '../common/Card';
import { AgingBarChart } from '../common/Charts';
import { AgingAnalysis } from '../../services/types';
import { Clock, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface AgingDistributionCardProps {
  aging: AgingAnalysis;
}

export const AgingDistributionCard: React.FC<AgingDistributionCardProps> = ({ aging }) => {
  const { t } = useTranslation();

  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.2rem' }}>
              {t('gov.agingTitle')}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('gov.agingSubtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--md-sys-color-risk-low)', fontSize: '0.8125rem', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>{t('gov.casesOverOneYear')}</span>
        </div>
      </div>

      <AgingBarChart aging={aging} title="" />
    </Card>
  );
};
