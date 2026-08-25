import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { AlertCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import { RiskFactor, RiskLevel } from '../../intelligence/types';
import { useTranslation } from '../../i18n';

export interface AttentionActionItem {
  entity: string;
  scope: string;
  dataset: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  riskScore: number;
  reasons: string[];
  factors?: RiskFactor[];
  recommendations: Array<{
    priority: string;
    action: string;
    rationale: string;
    targetMetric: string;
  }>;
  evidence: Array<{
    dataset: string;
    entity: string;
    metric: string;
    value: number | string;
    period: string;
    sourceUrl: string;
    sourceNote: string;
  }>;
}

export interface AttentionActionCockpitProps {
  items: AttentionActionItem[];
  onSelectDepartment: (entity: string) => void;
}

export const AttentionActionCockpit: React.FC<AttentionActionCockpitProps> = ({
  items,
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
              backgroundColor: 'var(--md-sys-color-risk-critical-container)',
              color: 'var(--md-sys-color-on-risk-critical-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.2rem' }}>
              {t('gov.tabAttention')} &bull; Action Cockpit
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Identifies public authorities requiring targeted administrative intervention with explainable causation
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="chip chip-critical">
            <span>{items.length} {t('gov.flaggedAuthorities')}</span>
          </span>
        </div>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items.map((item, idx) => {
          const riskLevel: RiskLevel = item.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
          const primaryRec = item.recommendations[0];

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                borderLeft: `5px solid ${item.severity === 'CRITICAL' ? 'var(--md-sys-color-risk-critical)' : 'var(--md-sys-color-risk-high)'}`,
              }}
            >
              {/* Header: WHAT & HOW SERIOUS */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <h4 className="title-medium" style={{ fontSize: '1.1rem', color: 'var(--md-sys-color-on-surface)' }}>
                    {item.entity}
                  </h4>
                  <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                    {item.scope}
                  </span>
                  <Badge riskLevel={riskLevel} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                    {t('gov.scoreLabel')} {item.riskScore}/100
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <EvidenceBadge evidence={item.evidence} />
                  <Button
                    variant="tonal"
                    style={{ minHeight: '36px', padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                    onClick={() => onSelectDepartment(item.entity)}
                  >
                    <span>{t('gov.inspectProfile')}</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>

              {/* 2-Column Structured Breakdown: WHY? WHAT SHOULD BE DONE? */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* WHY IT WAS FLAGGED */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '14px', border: '1px solid var(--md-sys-color-border-subtle)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('gov.whyFlaggedHeading')}
                  </span>
                  <ul style={{ paddingLeft: '1.125rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface)', marginTop: '0.35rem' }}>
                    {item.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* WHAT SHOULD BE DONE */}
                {primaryRec && (
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '14px', border: '1px solid var(--md-sys-color-border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <AlertCircle size={12} />
                      <span>{t('gov.recActionHeading')} ({primaryRec.priority})</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', marginTop: '0.35rem' }}>
                      {primaryRec.action}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.2rem' }}>
                      {primaryRec.rationale}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
