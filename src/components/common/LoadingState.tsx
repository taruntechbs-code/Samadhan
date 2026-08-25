import React from 'react';
import { Card } from './Card';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading CPGRAMS intelligence data...' }) => {
  return (
    <Card className="card-surface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem', textAlign: 'center', gap: '1rem' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid var(--md-sys-color-secondary-container)',
          borderTopColor: 'var(--md-sys-color-primary)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9375rem', fontWeight: 500 }}>
        {label}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Card>
  );
};
