import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AtmosphericBg } from '../common/AtmosphericBg';

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <AtmosphericBg />
      <Navbar />
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
