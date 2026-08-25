import React from 'react';
import { Card } from '../common/Card';
import { AgingBarChart } from '../common/Charts';
import { AgingAnalysis } from '../../services/types';
import { ShieldCheck, Layers } from 'lucide-react';

export interface AgingDistributionCardProps {
  aging: AgingAnalysis;
}

export const AgingDistributionCard: React.FC<AgingDistributionCardProps> = ({ aging }) => {
  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--md-sys-color-secondary-container)',
              color: 'var(--md-sys-color-on-secondary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
              System-Wide Pendency Aging Distribution
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Breakdown of {aging.total.toLocaleString('en-IN')} pending cases across standard resolution timelines
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--md-sys-color-risk-low)', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>0 cases &gt; 1 year</span>
        </div>
      </div>

      <AgingBarChart aging={aging} />
    </Card>
  );
};
