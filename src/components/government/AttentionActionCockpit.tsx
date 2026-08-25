import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AlertCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import { RiskLevel } from '../../intelligence/types';

export interface AttentionActionItem {
  entity: string;
  scope: string;
  dataset: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  riskScore: number;
  reasons: string[];
  recommendations: Array<{
    priority: string;
    action: string;
    rationale: string;
    targetMetric: string;
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
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
              Action Required &bull; Priority Triage Cockpit
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Identifies public authorities requiring targeted administrative intervention with explainable causation
            </p>
          </div>
        </div>

        <span className="chip chip-critical">
          <span>{items.length} Authorities Flagged</span>
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
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: `4px solid ${item.severity === 'CRITICAL' ? 'var(--md-sys-color-risk-critical)' : 'var(--md-sys-color-risk-high)'}`,
              }}
            >
              {/* Header: Entity Name + Badges + Inspect Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h4 className="title-medium" style={{ fontSize: '1.125rem', color: 'var(--md-sys-color-on-surface)' }}>
                    {item.entity}
                  </h4>
                  <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                    {item.scope}
                  </span>
                  <Badge riskLevel={riskLevel} />
                </div>

                <Button
                  variant="tonal"
                  style={{ minHeight: '36px', padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                  onClick={() => onSelectDepartment(item.entity)}
                >
                  <span>Inspect Audit Profile</span>
                  <ChevronRight size={16} />
                </Button>
              </div>

              {/* Reasons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Why this authority was flagged:
                </span>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)' }}>
                  {item.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              {primaryRec && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                  }}
                >
                  <AlertCircle size={16} style={{ color: 'var(--md-sys-color-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                      RECOMMENDED OPERATIONAL ACTION ({primaryRec.priority})
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)', marginTop: '0.15rem' }}>
                      {primaryRec.action}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
