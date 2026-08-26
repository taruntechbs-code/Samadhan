import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  FileText,
  BarChart3,
  Globe,
  ShieldCheck,
  Building2,
  Sliders,
  Menu,
  X
} from 'lucide-react';
import { TransparencyModal } from '../common/TransparencyModal';
import { JudgeScenarioBar } from '../citizen/JudgeScenarioBar';
import { useTranslation } from '../../i18n';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isEvaluatorOpen, setIsEvaluatorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleScenarioSelect = (query: string) => {
    window.dispatchEvent(new CustomEvent('samadhan:triggerScenario', { detail: { query } }));
    setIsEvaluatorOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Institutional Identity Strip */}
      <div className="gov-identity-bar">
        <div className="gov-identity-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.03em' }}>
              {language === 'hi' ? 'भारत सरकार • लोक शिकायत निवारण' : 'Government of India • Public Grievance Redressal'}
            </span>
            <span className="desktop-only" style={{ opacity: 0.5 }}>|</span>
            <span className="desktop-only" style={{ opacity: 0.85 }}>
              {language === 'hi' ? 'नागरिक-प्रौद्योगिकी प्रोटोटाइप' : 'Independent Civic-Tech Innovation'}
            </span>
          </div>

          <div className="desktop-only" style={{ alignItems: 'center', gap: '0.75rem', fontSize: '0.6875rem', opacity: 0.9 }}>
            <span>DARPG Verified</span>
            <span>•</span>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#93C5FD', textDecoration: 'none' }}
            >
              CPGRAMS &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Identity */}
          <NavLink to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-symbol">
              <span>स</span>
            </div>
            <div className="brand-title-group">
              <span className="brand-name">SAMADHAN</span>
              <span className="brand-tagline">
                {language === 'hi' ? 'लोक शिकायत निवारण प्रणाली' : 'Public Grievance Intelligence'}
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="desktop-only">
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

          {/* Desktop Action Tools */}
          <div className="desktop-only" style={{ alignItems: 'center', gap: '0.4rem' }}>
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

          {/* Mobile Actions: Language & Hamburger Button */}
          <div className="mobile-only" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-tonal"
              style={{
                fontSize: '0.75rem',
                minHeight: '38px',
                padding: '0.25rem 0.65rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 700,
              }}
              onClick={toggleLanguage}
              aria-label="Switch Language"
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            <button
              type="button"
              className="btn btn-text"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                padding: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--civic-text-primary)',
                borderRadius: 'var(--radius-md)',
              }}
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Slide Sheet */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" onClick={closeMobileMenu}>
          <div className="mobile-nav-sheet" onClick={e => e.stopPropagation()}>
            {/* Sheet Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--civic-border-light)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="brand-symbol" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                  <span>स</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--civic-text-primary)' }}>SAMADHAN</span>
              </div>
              <button
                type="button"
                className="btn btn-text"
                style={{ minHeight: '40px', minWidth: '40px', padding: '0.4rem', borderRadius: '50%' }}
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation List */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                style={{ minHeight: '48px', fontSize: '0.9375rem', width: '100%' }}
                onClick={closeMobileMenu}
                end
              >
                <Building2 size={18} />
                <span>{language === 'hi' ? 'नागरिक सेवाएँ' : 'Citizen Services'}</span>
              </NavLink>

              <NavLink
                to="/track"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                style={{ minHeight: '48px', fontSize: '0.9375rem', width: '100%' }}
                onClick={closeMobileMenu}
              >
                <Search size={18} />
                <span>{t('nav.track')}</span>
              </NavLink>

              <NavLink
                to="/grievances"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                style={{ minHeight: '48px', fontSize: '0.9375rem', width: '100%' }}
                onClick={closeMobileMenu}
              >
                <FileText size={18} />
                <span>{t('nav.grievances')}</span>
              </NavLink>

              <NavLink
                to="/government"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                style={{ minHeight: '48px', fontSize: '0.9375rem', width: '100%' }}
                onClick={closeMobileMenu}
              >
                <BarChart3 size={18} />
                <span>{language === 'hi' ? 'सरकारी प्रज्ञान' : 'Government Intelligence'}</span>
              </NavLink>
            </nav>

            {/* Quick Action Utilities */}
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--civic-border-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-tonal"
                style={{ minHeight: '44px', width: '100%', justifyContent: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', fontWeight: 600 }}
                onClick={() => {
                  closeMobileMenu();
                  setIsEvaluatorOpen(true);
                }}
              >
                <Sliders size={17} style={{ color: 'var(--civic-brand)' }} />
                <span>{language === 'hi' ? 'मूल्यांकनकर्ता डेमो (5 परिदृश्य)' : 'Evaluator Demo (5 Scenarios)'}</span>
              </button>

              <button
                type="button"
                className="btn btn-text"
                style={{ minHeight: '44px', width: '100%', justifyContent: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--civic-text-secondary)' }}
                onClick={() => {
                  closeMobileMenu();
                  setIsTrustOpen(true);
                }}
              >
                <ShieldCheck size={17} style={{ color: 'var(--civic-brand)' }} />
                <span>{t('nav.trust')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

