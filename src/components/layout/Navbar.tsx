import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  FileText,
  BarChart3,
  Globe,
  ShieldCheck,
  Building2,
  Sliders
} from 'lucide-react';
import { TransparencyModal } from '../common/TransparencyModal';
import { JudgeScenarioBar } from '../citizen/JudgeScenarioBar';
import { useTranslation } from '../../i18n';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isEvaluatorOpen, setIsEvaluatorOpen] = useState(false);

  const handleScenarioSelect = (query: string) => {
    // If on homepage or elsewhere, trigger scenario
    window.dispatchEvent(new CustomEvent('samadhan:triggerScenario', { detail: { query } }));
    setIsEvaluatorOpen(false);
  };

  return (
    <>
      {/* Top Institutional Identity Strip */}
      <div className="gov-identity-bar">
        <div className="gov-identity-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'भारत सरकार • लोक शिकायत निवारण एवं प्रज्ञान' : 'Government of India • Public Grievance Redressal & Intelligence'}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ opacity: 0.85 }}>
              {language === 'hi' ? 'नागरिक-प्रौद्योगिकी प्रोटोटाइप' : 'Independent Civic-Tech Innovation'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.6875rem', opacity: 0.9 }}>
            <span>DARPG Verified Data</span>
            <span>•</span>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#93C5FD', textDecoration: 'none' }}
            >
              Official CPGRAMS Portal &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Identity */}
          <NavLink to="/" className="brand-link">
            <div className="brand-symbol">
              <span>स</span>
            </div>
            <div className="brand-title-group">
              <span className="brand-name">SAMADHAN</span>
              <span className="brand-tagline">
                {language === 'hi' ? 'लोक शिकायत निवारण एवं प्रज्ञान प्रणाली' : 'Public Grievance Redressal & Intelligence'}
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links-list">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  end
                >
                  <Building2 size={16} />
                  <span>{language === 'hi' ? 'नागरिक सेवाएँ' : 'Citizen Services'}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/track"
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                >
                  <Search size={16} />
                  <span>{t('nav.track')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/grievances"
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                >
                  <FileText size={16} />
                  <span>{t('nav.grievances')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/government"
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                >
                  <BarChart3 size={16} />
                  <span>{language === 'hi' ? 'सरकारी प्रज्ञान' : 'Government Intelligence'}</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-text"
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsEvaluatorOpen(true)}
              title="Open Evaluator Demo Scenarios"
            >
              <Sliders size={15} style={{ color: 'var(--civic-brand)' }} />
              <span>{language === 'hi' ? 'डेमो परिदृश्य' : 'Evaluator Demo'}</span>
            </button>

            <button
              type="button"
              className="btn btn-text"
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsTrustOpen(true)}
              title={t('nav.trust')}
            >
              <ShieldCheck size={16} style={{ color: 'var(--civic-brand)' }} />
              <span>{t('nav.trust')}</span>
            </button>

            <button
              type="button"
              className="btn btn-tonal"
              style={{
                fontSize: '0.8125rem',
                minHeight: '36px',
                padding: '0.35rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
              }}
              onClick={toggleLanguage}
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
              aria-label="Toggle language between English and Hindi"
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Transparency Modal */}
      <TransparencyModal isOpen={isTrustOpen} onClose={() => setIsTrustOpen(false)} />

      {/* Global Evaluator Console */}
      <JudgeScenarioBar
        isOpen={isEvaluatorOpen}
        onClose={() => setIsEvaluatorOpen(false)}
        onSelectScenario={handleScenarioSelect}
      />
    </>
  );
};
