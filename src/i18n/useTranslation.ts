/**
 * SAMADHAN — useTranslation Hook
 * Separated hook module to ensure clean Fast Refresh boundaries in Vite.
 */

import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import { en } from './en';
import { Language, LanguageContextValue } from './types';

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a default fallback if used outside React Provider
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => {
        const segments = key.split('.');
        let current: any = en;
        for (const seg of segments) {
          if (current && typeof current === 'object' && seg in current) {
            current = current[seg];
          } else {
            return fallback || key;
          }
        }
        return typeof current === 'string' ? current : fallback || key;
      },
    };
  }
  return context;
}
