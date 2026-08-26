import React from 'react';
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
  const { language } = useTranslation();

  return (
    <div
      className="card-surface"
      style={{
        border: '1px solid var(--civic-border-medium)',
        backgroundColor: '#FFFFFF',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'var(--civic-danger-bg)',
              color: 'var(--civic-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <span className="chip chip-critical" style={{ fontSize: '0.6875rem' }}>
                {language === 'hi' ? 'निर्णायक प्रशासनिक हस्तक्षेप' : 'ACTION REQUIRED'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                {items.length} {language === 'hi' ? 'प्राधिकरण चिह्नित' : 'Flagged Authorities'}
              </span>
            </div>
            <h3 className="title-large" style={{ fontSize: '1.15rem', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'प्रशासनिक ध्यान एवं कार्रवाई कॉकपिट' : 'What Needs Administrative Attention?'}
            </h3>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
          Deterministic 0–100 Risk Engine &bull; Non-Accusatory Causation
        </span>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item, idx) => {
          const riskLevel: RiskLevel = item.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
          const primaryRec = item.recommendations[0];

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--civic-canvas-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                border: '1px solid var(--civic-border-light)',
                borderLeft: `4px solid ${item.severity === 'CRITICAL' ? 'var(--civic-danger)' : 'var(--civic-warning)'}`,
              }}
            >
              {/* Top Row: WHAT & HOW SERIOUS */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h4 className="title-medium" style={{ fontSize: '1.05rem', color: 'var(--civic-text-primary)' }}>
                    {item.entity}
                  </h4>
                  <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                    {item.scope}
                  </span>
                  <Badge riskLevel={riskLevel} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-brand)' }}>
                    Risk: {item.riskScore}/100
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <EvidenceBadge evidence={item.evidence} />
                  <Button
                    variant="tonal"
                    style={{ minHeight: '32px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
                    onClick={() => onSelectDepartment(item.entity)}
                  >
                    <span>{language === 'hi' ? 'प्रोफ़ाइल निरीक्षण' : 'Inspect Profile'}</span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>

              {/* 2-Column Structured Briefing: WHY? WHAT SHOULD BE DONE? */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.875rem' }}>
                {/* WHY IT MATTERS / REASONS */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--civic-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'hi' ? 'कारण एवं व्याख्या (WHY IT MATTERS)' : 'WHY THIS AUTHORITY WAS FLAGGED'}
                  </span>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.8125rem', color: 'var(--civic-text-primary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                    {item.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* RECOMMENDED OPERATIONAL ACTION */}
                {primaryRec && (
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--civic-brand)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <AlertCircle size={12} />
                      <span>{language === 'hi' ? 'अनुशंसित प्रशासनिक कार्रवाई' : 'RECOMMENDED OPERATIONAL ACTION'} ({primaryRec.priority})</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--civic-text-primary)', marginTop: '0.25rem' }}>
                      {primaryRec.action}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', marginTop: '0.15rem' }}>
                      {primaryRec.rationale}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
