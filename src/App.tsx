import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { TrackPage } from './pages/TrackPage';
import { GrievancesPage } from './pages/GrievancesPage';
import { GovernmentPage } from './pages/GovernmentPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="grievances" element={<GrievancesPage />} />
            <Route path="government" element={<GovernmentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
