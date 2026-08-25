import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SystemInsight } from '../../intelligence/types';
import { Sparkles, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface SystemInsightsCardProps {
  insight: SystemInsight;
  onSelectDepartment?: (entity: string) => void;
}

export const SystemInsightsCard: React.FC<SystemInsightsCardProps> = ({
  insight,
  onSelectDepartment,
}) => {
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
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.2rem' }}>
              {insight.title}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('systemInsights.subtitle')}
            </p>
          </div>
        </div>

        <Badge type="primary">
          <span>{insight.agingConcentration.primaryBucket}</span>
        </Badge>
      </div>

      {/* Summary Paragraph */}
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-card)',
          fontSize: '0.9375rem',
          lineHeight: 1.5,
          color: 'var(--md-sys-color-on-surface)',
        }}
      >
        {insight.summary}
      </div>

      {/* Key Analytical Findings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('systemInsights.keyFindings')}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {insight.keyFindings.map((finding, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                fontSize: '0.875rem',
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              <CheckCircle2
                size={16}
                style={{ color: 'var(--md-sys-color-primary)', marginTop: '2px', flexShrink: 0 }}
              />
              <span>{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers Recognition */}
      {insight.topPerformingEntities && insight.topPerformingEntities.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--md-sys-color-surface-container-low)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-risk-low)' }}>
            <Award size={16} />
            <span>{t('systemInsights.topPerformers')}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {insight.topPerformingEntities.map((perf, idx) => (
              <button
                key={idx}
                type="button"
                className="chip chip-low"
                style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                onClick={() => onSelectDepartment && onSelectDepartment(perf.entity)}
              >
                <span>{perf.entity} ({perf.disposalRate}%)</span>
                <ChevronRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
