import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
            <Shield size={16} />
            <span>SAMADHAN &mdash; Citizen-Centric Public Redressal Platform</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Powered by verified administrative metrics from DARPG & CPGRAMS public analytics datasets.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem' }}>
          <a
            href="https://pgportal.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
          >
            <span>CPGRAMS Portal</span>
            <ExternalLink size={12} />
          </a>
          <span>•</span>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            National Civic Tech Initiative &copy; 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
