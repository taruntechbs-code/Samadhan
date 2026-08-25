import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoadingSpinner } from './components/common/LoadingState';

const TrackPage = lazy(() => import('./pages/TrackPage').then(m => ({ default: m.TrackPage })));
const GrievancesPage = lazy(() => import('./pages/GrievancesPage').then(m => ({ default: m.GrievancesPage })));
const GovernmentPage = lazy(() => import('./pages/GovernmentPage').then(m => ({ default: m.GovernmentPage })));

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="track"
              element={
                <Suspense fallback={<LoadingSpinner label="Loading tracking timeline..." />}>
                  <TrackPage />
                </Suspense>
              }
            />
            <Route
              path="grievances"
              element={
                <Suspense fallback={<LoadingSpinner label="Loading citizen grievances..." />}>
                  <GrievancesPage />
                </Suspense>
              }
            />
            <Route
              path="government"
              element={
                <Suspense fallback={<LoadingSpinner label="Compiling CPGRAMS telemetry..." />}>
                  <GovernmentPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
