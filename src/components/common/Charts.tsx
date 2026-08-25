import React from 'react';
import { AgingAnalysis } from '../../services/types';
import { formatIndianNumber } from './MetricCard';

export interface AgingChartProps {
  aging: AgingAnalysis;
  title?: string;
}

export const AgingBarChart: React.FC<AgingChartProps> = ({ aging, title }) => {
  const total = aging.total > 0 ? aging.total : 1;

  const buckets = [
    {
      label: '0 – 60 Days',
      count: aging['0_60_days'],
      color: '#6750A4',
      tag: 'Fresh throughput',
    },
    {
      label: '60 – 180 Days',
      count: aging['60_180_days'],
      color: '#8C6200',
      tag: 'Under active inquiry',
    },
    {
      label: '180 – 365 Days',
      count: aging['180_365_days'],
      color: '#C0441E',
      tag: 'Approaching 1 year',
    },
    {
      label: '> 1 Year',
      count: aging['over_1_year'],
      color: '#B3261E',
      tag: 'Chronic pendency',
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <h3 className="title-medium" style={{ marginBottom: '1.25rem' }}>
          {title}
        </h3>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {buckets.map((b, idx) => {
          const pct = ((b.count / total) * 100).toFixed(1);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>
                  {b.label}
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                    ({b.tag})
                  </span>
                </span>
                <span style={{ fontWeight: 700, color: b.color }}>
                  {formatIndianNumber(b.count)} cases ({pct}%)
                </span>
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  height: '12px',
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(Number(pct), b.count > 0 ? 2 : 0)}%`,
                    backgroundColor: b.color,
                    borderRadius: '9999px',
                    transition: 'width 0.6s cubic-bezier(0.2, 0, 0, 1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface DisposalRateBarProps {
  rate: number;
  label?: string;
}

export const DisposalRateBar: React.FC<DisposalRateBarProps> = ({ rate, label }) => {
  let color = 'var(--md-sys-color-risk-low)';
  if (rate < 70) color = 'var(--md-sys-color-risk-critical)';
  else if (rate < 80) color = 'var(--md-sys-color-risk-high)';
  else if (rate < 90) color = 'var(--md-sys-color-risk-medium)';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
        {label && <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{label}</span>}
        <span style={{ fontWeight: 700, color }}>{rate}%</span>
      </div>
      <div
        style={{
          height: '8px',
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(Math.max(rate, 0), 100)}%`,
            backgroundColor: color,
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  );
};
