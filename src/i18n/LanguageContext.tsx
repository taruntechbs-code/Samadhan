/**
 * SAMADHAN — Language Context & Provider
 * Manages global language state with localStorage persistence and fallback key resolution.
 */

import React, { createContext, useState, useMemo } from 'react';
import { en } from './en';
import { hi } from './hi';
import { Language, LanguageContextValue } from './types';

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'samadhan_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'hi' || stored === 'en') {
          return stored;
        }
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const translations = useMemo(() => {
    return language === 'hi' ? hi : en;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const segments = key.split('.');
    let current: any = translations;

    for (const segment of segments) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment];
      } else {
        // Fallback to English dictionary if key missing in current language
        let enCurrent: any = en;
        for (const enSeg of segments) {
          if (enCurrent && typeof enCurrent === 'object' && enSeg in enCurrent) {
            enCurrent = enCurrent[enSeg];
          } else {
            return fallback || key;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : fallback || key;
      }
    }

    return typeof current === 'string' ? current : fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
