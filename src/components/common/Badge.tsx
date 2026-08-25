import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { RiskLevel } from '../../intelligence/types';

export interface BadgeProps {
  type?: 'primary' | 'secondary' | 'risk' | 'status';
  riskLevel?: RiskLevel;
  status?: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'primary',
  riskLevel,
  status,
  children,
  className = '',
  style,
  icon = true,
}) => {
  if (riskLevel) {
    let chipClass = 'chip-low';
    let RiskIcon = CheckCircle;
    let label = 'LOW RISK';

    if (riskLevel === 'CRITICAL') {
      chipClass = 'chip-critical';
      RiskIcon = AlertCircle;
      label = 'CRITICAL RISK';
    } else if (riskLevel === 'HIGH') {
      chipClass = 'chip-high';
      RiskIcon = AlertTriangle;
      label = 'HIGH RISK';
    } else if (riskLevel === 'MEDIUM') {
      chipClass = 'chip-medium';
      RiskIcon = Info;
      label = 'MEDIUM RISK';
    }

    return (
      <span className={`chip ${chipClass} ${className}`} style={style}>
        {icon && <RiskIcon size={14} />}
        <span>{children || label}</span>
      </span>
    );
  }

  if (status) {
    let chipClass = 'chip-secondary';
    let label = status.replace('_', ' ');

    if (status === 'RESOLVED') {
      chipClass = 'chip-low';
    } else if (status === 'IN_PROGRESS') {
      chipClass = 'chip-primary';
    } else if (status === 'UNDER_REVIEW') {
      chipClass = 'chip-medium';
    }

    return (
      <span className={`chip ${chipClass} ${className}`} style={style}>
        <span>{children || label}</span>
      </span>
    );
  }

  const chipClass = type === 'secondary' ? 'chip-secondary' : 'chip-primary';
  return (
    <span className={`chip ${chipClass} ${className}`} style={style}>
      {children}
    </span>
  );
};
