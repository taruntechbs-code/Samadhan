import React from 'react';
import { BarChart3 } from 'lucide-react';

export const GovernmentPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Government Analytics & Operations</h1>
        <p>Department-level oversight, disposal velocity, and pendency analytics across ministries.</p>
      </div>

      <div className="placeholder-box">
        <div className="placeholder-badge">
          <BarChart3 size={16} />
          Phase 0 Placeholder
        </div>
        <h2>CPGRAMS Verified Aggregate Dashboard</h2>
        <p style={{ maxWidth: '540px', color: 'var(--color-text-muted)' }}>
          Official aggregate metrics dataset (<code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>10_MASTER_verified_cpgrams_metrics_long.csv</code>) will power this dashboard in subsequent phases.
        </p>
      </div>
    </div>
  );
};
