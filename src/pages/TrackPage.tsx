import React from 'react';
import { Search } from 'lucide-react';

export const TrackPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Track Grievance</h1>
        <p>Monitor real-time progress and escalation status of your filed grievances.</p>
      </div>

      <div className="placeholder-box">
        <div className="placeholder-badge">
          <Search size={16} />
          Phase 0 Placeholder
        </div>
        <h2>Grievance Tracking System</h2>
        <p style={{ maxWidth: '540px', color: 'var(--color-text-muted)' }}>
          Tracking mechanisms and milestone history views will be connected in future phases.
        </p>
      </div>
    </div>
  );
};
