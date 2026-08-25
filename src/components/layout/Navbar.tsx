import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, FileText, BarChart3, Globe, ShieldCheck } from 'lucide-react';
import { TransparencyModal } from '../common/TransparencyModal';
import { useTranslation } from '../../i18n';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const location = useLocation();
  const isGov = location.pathname.startsWith('/government');

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo & Tagline */}
          <NavLink to="/" className="brand-link">
            <div className="brand-symbol">
              <span>स</span>
            </div>
            <div className="brand-title-group">
              <span className="brand-name">SAMADHAN</span>
              <span className="brand-tagline">{t('nav.tagline')}</span>
            </div>
          </NavLink>

          {/* Navigation Tabs */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links-list">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
                  end
                >
                  <Home size={18} />
                  <span>{t('nav.home')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/track"
                  className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
                >
                  <Search size={18} />
                  <span>{t('nav.track')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/grievances"
                  className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
                >
                  <FileText size={18} />
                  <span>{t('nav.grievances')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/government"
                  className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: isGov ? 'var(--md-sys-color-primary-container)' : undefined,
                    color: isGov ? 'var(--md-sys-color-on-primary-container)' : undefined,
                  }}
                >
                  <BarChart3 size={18} />
                  <span>{t('nav.government')}</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Trust & Language Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-text"
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsTrustOpen(true)}
              title={t('nav.trust')}
            >
              <ShieldCheck size={16} style={{ color: 'var(--md-sys-color-primary)' }} />
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
              <Globe size={15} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      <TransparencyModal isOpen={isTrustOpen} onClose={() => setIsTrustOpen(false)} />
    </>
  );
};
