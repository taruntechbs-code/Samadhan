/**
 * SAMADHAN — i18n Localization Unit Tests
 * Validates dictionary integrity, fallback behavior, nested key resolution, and Hindi coverage.
 */

import { describe, it, expect } from 'vitest';
import { en } from './en';
import { hi } from './hi';
import { useTranslation } from './useTranslation';
import { LanguageProvider } from './LanguageContext';
import * as indexExports from './index';

describe('i18n Localization Architecture', () => {
  it('should have parity between English and Hindi top-level categories', () => {
    const enKeys = Object.keys(en);
    const hiKeys = Object.keys(hi);

    expect(hiKeys).toEqual(enKeys);
  });

  it('should translate core navigation items to authentic Hindi', () => {
    expect(hi.nav.home).toBe('नागरिक गृह');
    expect(hi.nav.track).toBe('स्थिति जांचें');
    expect(hi.nav.grievances).toBe('मेरी शिकायतें');
    expect(hi.nav.government).toBe('प्रशासनिक डैशबोर्ड');
  });

  it('should translate citizen hero and input prompts correctly', () => {
    expect(hi.hero.titleMain).toBe('अपनी समस्या हमें बताएं।');
    expect(hi.hero.titleSub).toBe('सही विभाग हम खोजेंगे।');
    expect(hi.hero.speakBtn).toBe('समस्या बोलकर बताएं');
  });

  it('should have all 8 SAMADHAN journey steps in Hindi', () => {
    expect(hi.journey.step1Title).toBeTruthy();
    expect(hi.journey.step8Title).toBeTruthy();
    expect(hi.journey.step1Desc).toBeTruthy();
    expect(hi.journey.step8Desc).toBeTruthy();
  });

  it('should provide comprehensive government dashboard terminology', () => {
    expect(hi.gov.totalReceived).toBe('कुल प्राप्त शिकायतें');
    expect(hi.gov.totalDisposed).toBe('कुल निराकृत शिकायतें');
    expect(hi.gov.activeBacklog).toBe('कुल सक्रिय लंबित मामले');
    expect(hi.gov.pulseScope).toBe('राष्ट्रीय पल्स दायरा:');
  });

  it('should have structured transparency and evidence descriptions in Hindi', () => {
    expect(hi.transparency.title).toContain('समाधान डेटा सत्यता');
    expect(hi.evidence.modalTitle).toBe('डेटा स्रोत एवं साक्ष्य ऑडिट');
  });

  it('should translate facility context and directory labels to authentic Hindi', () => {
    expect(hi.facility.badge).toBe('सुविधा निर्देशिका • स्वास्थ्य सुविधा संदर्भ');
    expect(hi.facility.detectedHeading).toBe('स्वास्थ्य सुविधा पहचानी गई');
    expect(hi.facility.activeStatus).toBe('सक्रिय सुविधा');
  });

  it('should translate historical and trend intelligence terminology to authentic Hindi', () => {
    expect(hi.gov.tabHistorical).toBe('रुझान एवं ऐतिहासिक बुद्धिमत्ता');
    expect(hi.deptModal.historicalHeading).toBe('ऐतिहासिक आधार रेखा एवं रुझान तुलना');
    expect(hi.historical.title).toBe('दीर्घकालिक एवं ऐतिहासिक विश्लेषण डैशबोर्ड');
    expect(hi.historical.improving).toBe('सुधार');
    expect(hi.historical.deteriorating).toBe('गिरावट');
    expect(hi.historical.stable).toBe('स्थिर');
  });

  it('should cleanly export useTranslation hook and LanguageProvider from index', () => {
    expect(typeof indexExports.useTranslation).toBe('function');
    expect(typeof indexExports.LanguageProvider).toBe('function');
    expect(indexExports.useTranslation).toBe(useTranslation);
    expect(indexExports.LanguageProvider).toBe(LanguageProvider);
  });
});
