import React from 'react';
import { Card } from './Card';
import { HelpCircle } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  sourceNote?: string;
  accentColor?: string;
  className?: string;
}

export function formatIndianNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  sourceNote,
  accentColor,
  className = '',
}) => {
  const displayValue = typeof value === 'number' ? formatIndianNumber(value) : value;

  return (
    <Card className={`kpi-card ${className}`}>
      <div className="kpi-header">
        <span style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {title}
        </span>
        {icon && <span style={{ color: accentColor || 'var(--md-sys-color-primary)' }}>{icon}</span>}
      </div>

      <div className="kpi-value" style={{ color: accentColor || 'var(--md-sys-color-on-surface)' }}>
        {displayValue}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
        {sourceNote && (
          <span
            title={sourceNote}
            style={{
              cursor: 'help',
              color: 'var(--md-sys-color-outline)',
              display: 'inline-flex',
              alignItems: 'center',
              marginLeft: 'auto',
            }}
          >
            <HelpCircle size={14} />
          </span>
        )}
      </div>
    </Card>
  );
};
