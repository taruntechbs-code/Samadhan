import React, { useState } from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { TransparencyModal } from '../common/TransparencyModal';
import { useTranslation } from '../../i18n';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Column 1: Brand & Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--civic-brand)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  स
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--civic-text-primary)' }}>
                  SAMADHAN
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-muted)', lineHeight: 1.6 }}>
                {language === 'hi'
                  ? 'नागरिक-केंद्रित लोक शिकायत निवारण एवं प्रज्ञान मंच। प्राकृतिक भाषा इनपुट को 278 वास्तविक सरकारी प्राधिकरणों से जोड़ता है।'
                  : 'National civic-tech grievance intelligence architecture. Connecting everyday citizen language directly to 278 real public authorities with explainable evidence.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--civic-brand)', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>DARPG 2,134 Verified CPGRAMS Records</span>
              </div>
            </div>

            {/* Column 2: Citizen Services */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'नागरिक सेवाएँ' : 'Citizen Services'}
              </span>
              <NavLink to="/" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'शिकायत दर्ज करें' : 'Lodge Grievance'}
              </NavLink>
              <NavLink to="/track" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'स्थिति ट्रैक करें' : 'Track Grievance Status'}
              </NavLink>
              <NavLink to="/grievances" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'मेरी शिकायतें' : 'My Grievances Portfolio'}
              </NavLink>
              <button
                type="button"
                className="btn btn-text"
                style={{ padding: 0, minHeight: 'auto', fontSize: '0.8125rem', color: 'var(--civic-brand)', justifyContent: 'flex-start' }}
                onClick={() => setIsTrustOpen(true)}
              >
                {language === 'hi' ? 'पारदर्शिता एवं डेटा स्रोत' : 'Trust & Methodology'}
              </button>
            </div>

            {/* Column 3: Government Intelligence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'सरकारी प्रज्ञान' : 'Government Intelligence'}
              </span>
              <NavLink to="/government" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'प्रशासनिक कॉकपिट' : 'Executive Operations Cockpit'}
              </NavLink>
              <NavLink to="/government" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'कार्रवाई आवश्यक (एक्शन कॉकपिट)' : 'Attention Action Cockpit'}
              </NavLink>
              <NavLink to="/government" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? '10-वर्षीय ऐतिहासिक रुझान' : '10-Year Historical Trends'}
              </NavLink>
              <NavLink to="/government" style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', textDecoration: 'none' }}>
                {language === 'hi' ? 'द्वितीयक अपील विश्लेषण' : 'Appeals Redressal Audit'}
              </NavLink>
            </div>

            {/* Column 4: Official Data Provenance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'आधिकारिक स्रोत एवं संदर्भ' : 'Official Data Provenance'}
              </span>
              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: 'var(--civic-brand)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>CPGRAMS Official Portal</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: 'var(--civic-brand)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>Open Government Data (Data.gov.in)</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://facility.ndhm.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: 'var(--civic-brand)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>NHA Healthcare Facility Directory</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Bottom Line & Legal Notice */}
          <div className="footer-bottom">
            <div>
              &copy; 2026 SAMADHAN &bull; Independent Civic-Tech Architecture Prototype. Non-commercial demonstration.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-text"
                style={{ padding: 0, minHeight: 'auto', fontSize: '0.8125rem', color: 'var(--civic-text-muted)' }}
                onClick={() => setIsTrustOpen(true)}
              >
                {t('footer.methodology')}
              </button>
              <span>•</span>
              <span style={{ color: 'var(--civic-text-muted)' }}>
                WCAG 2.1 AA Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>

      <TransparencyModal isOpen={isTrustOpen} onClose={() => setIsTrustOpen(false)} />
    </>
  );
};
