import React from 'react';
import { Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Citizen Grievance Redressal Portal</h1>
        <p>A transparent, responsive platform for Indian citizens to file, monitor, and resolve public grievances.</p>
      </div>

      <div className="placeholder-box">
        <div className="placeholder-badge">
          <Shield size={16} />
          Phase 0 Initialized
        </div>
        <h2>Citizen Home Experience</h2>
        <p style={{ maxWidth: '540px', color: 'var(--color-text-muted)' }}>
          Foundation active. Citizen grievance lodging interface, category routing, and status previews will be configured in subsequent phases.
        </p>
      </div>
    </div>
  );
};
