import React from 'react';
import { FileText } from 'lucide-react';

export const GrievancesPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>My Grievances</h1>
        <p>Review active submissions, resolution notices, and past grievance history.</p>
      </div>

      <div className="placeholder-box">
        <div className="placeholder-badge">
          <FileText size={16} />
          Phase 0 Placeholder
        </div>
        <h2>Citizen Grievance Records</h2>
        <p style={{ maxWidth: '540px', color: 'var(--color-text-muted)' }}>
          Citizen dashboard views and history listings will be integrated in upcoming phases.
        </p>
      </div>
    </div>
  );
};
