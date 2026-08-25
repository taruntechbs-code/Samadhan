import React from 'react';
import { Card } from '../common/Card';
import { SystemInsight } from '../../intelligence/types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export interface SystemInsightsCardProps {
  insight: SystemInsight;
  onSelectDepartment?: (entity: string) => void;
}

export const SystemInsightsCard: React.FC<SystemInsightsCardProps> = ({
  insight,
  onSelectDepartment,
}) => {
  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          }}
        >
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
            {insight.title}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            AI-synthesized administrative observations from verified metrics
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--md-sys-color-on-surface)' }}>
        {insight.summary}
      </p>

      {/* Key Findings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Key Analytical Findings:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {insight.keyFindings.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: '14px',
                padding: '0.875rem 1.125rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                fontSize: '0.875rem',
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--md-sys-color-primary)', marginTop: '2px', flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Performers Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Exemplary Disposal Velocity (Top Performers):
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.625rem' }}>
          {insight.topPerformingEntities.map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: onSelectDepartment ? 'pointer' : 'default',
              }}
              onClick={() => onSelectDepartment && onSelectDepartment(t.entity)}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                {t.entity}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--md-sys-color-risk-low)' }}>
                {t.disposalRate}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
