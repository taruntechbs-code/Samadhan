import React from 'react';
import { Card } from '../common/Card';
import { AppealsOverview } from '../../services/types';
import { formatIndianNumber } from '../common/MetricCard';
import { FileQuestion } from 'lucide-react';

export interface AppealsIntelligenceCardProps {
  appeals: AppealsOverview;
  onSelectDepartment?: (entity: string) => void;
}

export const AppealsIntelligenceCard: React.FC<AppealsIntelligenceCardProps> = ({
  appeals,
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
              backgroundColor: 'var(--md-sys-color-tertiary-container)',
              color: 'var(--md-sys-color-on-tertiary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileQuestion size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
              Appellate Redressal Intelligence Snapshot
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Independent audit of secondary appeals filed under CPGRAMS across {appeals.departmentCount} central departments
            </p>
          </div>
        </div>

        <span className="chip chip-primary">
          <span>{appeals.appealDisposalRate}% Disposal Velocity</span>
        </span>
      </div>

      {/* 3 Metric Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>Total Appeals Received</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
            {formatIndianNumber(appeals.appealsReceived)}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>Total Appeals Disposed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--md-sys-color-risk-low)' }}>
            {formatIndianNumber(appeals.appealsDisposed)}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>Appeals Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--md-sys-color-risk-medium)' }}>
            {formatIndianNumber(appeals.appealsPending)}
          </div>
        </div>
      </div>

      {/* Top 5 High-Volume Appeals Authorities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Top Authorities Handling Appeals:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.625rem' }}>
          {appeals.departmentAppeals.slice(0, 4).map((d, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: onSelectDepartment ? 'pointer' : 'default',
              }}
              onClick={() => onSelectDepartment && onSelectDepartment(d.entity)}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                  {d.entity.length > 28 ? d.entity.slice(0, 28) + '...' : d.entity}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {formatIndianNumber(d.received)} received &bull; {d.disposalRate}% resolved
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                {formatIndianNumber(d.pending)} pend
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
