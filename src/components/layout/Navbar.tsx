import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, FileText, BarChart3, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const location = useLocation();
  const isGov = location.pathname.startsWith('/government');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Tagline */}
        <NavLink to="/" className="brand-link">
          <div className="brand-symbol">
            <span>स</span>
          </div>
          <div className="brand-title-group">
            <span className="brand-name">SAMADHAN</span>
            <span className="brand-tagline">Public Grievance Redressal & Intelligence</span>
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
                <span>{lang === 'EN' ? 'Citizen Home' : 'मुख्य पृष्ठ'}</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/track"
                className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
              >
                <Search size={18} />
                <span>{lang === 'EN' ? 'Track Status' : 'स्थिति जांचें'}</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/grievances"
                className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>{lang === 'EN' ? 'My Grievances' : 'मेरी शिकायतें'}</span>
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
                <span>{lang === 'EN' ? 'Gov Operations' : 'प्रशासनिक डैशबोर्ड'}</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-text"
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            onClick={() => setLang(l => (l === 'EN' ? 'HI' : 'EN'))}
            title="Toggle Language"
          >
            <Globe size={16} />
            <span>{lang === 'EN' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
