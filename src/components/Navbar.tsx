import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, FileText, BarChart3 } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <div className="brand-badge">
            <span>स</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">SAMADHAN</span>
            <span className="brand-subtitle">Public Grievance Portal</span>
          </div>
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
              >
                <Home size={18} />
                <span>Citizen Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/track" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Search size={18} />
                <span>Track Grievance</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/grievances" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>My Grievances</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/government" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>Government Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
