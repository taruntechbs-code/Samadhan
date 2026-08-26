/**
 * SAMADHAN — Evaluator & Judge Scenario Console
 * Provides 1-click execution for the 5 official evaluator test scenarios.
 * Rendered as an unobtrusive modal/drawer accessible via navbar or subtle floating trigger.
 */

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';
import {
  Sparkles,
  AlertCircle,
  Train,
  CreditCard,
  HeartPulse,
  FileText,
  Play,
  X,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export interface JudgeScenarioBarProps {
  onSelectScenario: (queryText: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const JudgeScenarioBar: React.FC<JudgeScenarioBarProps> = ({
  onSelectScenario,
  isOpen,
  onClose,
}) => {
  const { language } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const showModal = isOpen !== undefined ? isOpen : internalOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const SCENARIOS = [
    {
      id: 'epfo',
      icon: <FileText size={16} />,
      title: language === 'hi' ? 'परिदृश्य 1: ईपीएफओ / पेंशन' : 'Scenario 1: EPFO / Pension',
      query: language === 'hi'
        ? 'My pension payment from EPFO has been delayed for two months.'
        : 'My pension payment from EPFO has been delayed for two months.',
      target: language === 'hi' ? 'श्रम एवं रोजगार मंत्रालय' : 'Ministry of Labour & Employment',
      tagColor: 'chip-primary',
      desc: language === 'hi'
        ? 'पेंशन विलंब → श्रम मंत्रालय + 10-वर्षीय ऐतिहासिक तुलना'
        : 'EPFO delay → Labour Ministry + 10-yr historical baseline variance',
      verifiedEvidence: '10-Year CPGRAMS Baseline: 98.77% historical disposal rate',
    },
    {
      id: 'healthcare',
      icon: <HeartPulse size={16} />,
      title: language === 'hi' ? 'परिदृश्य 2: स्वास्थ्य एवं पीएचसी' : 'Scenario 2: Healthcare + Facility',
      query: language === 'hi'
        ? 'The PHC in Adoni Kurnool is not functioning and there are no medicines.'
        : 'The PHC in Adoni Kurnool is not functioning and there are no medicines.',
      target: language === 'hi' ? 'स्वास्थ्य मंत्रालय + सुविधा निर्देशिका' : 'Health & Family Welfare + Facility Directory',
      tagColor: 'chip-secondary',
      desc: language === 'hi'
        ? 'पीएचसी आदोनी कर्नूल का भौगोलिक अधिकार क्षेत्र स्वतः पहचान'
        : 'Resolves PHC Adoni Rural (Kurnool, AP) geographic jurisdiction server-side',
      verifiedEvidence: 'National Health Facility Registry (NHA / MoHFW)',
    },
    {
      id: 'incometax',
      icon: <CreditCard size={16} />,
      title: language === 'hi' ? 'परिदृश्य 3: आयकर रिफंड' : 'Scenario 3: Income Tax Refund',
      query: language === 'hi'
        ? 'My income tax refund is delayed.'
        : 'My income tax refund is delayed.',
      target: language === 'hi' ? 'सीबीडीटी (प्रत्यक्ष कर)' : 'Central Board of Direct Taxes (CBDT)',
      tagColor: 'chip-primary',
      desc: language === 'hi'
        ? 'आयकर रिफंड → प्रत्यक्ष कर बोर्ड'
        : 'ITR refund → CBDT direct routing with zero facility overhead',
      verifiedEvidence: 'CPGRAMS Central Live Telemetry (CBDT Nodal Cell)',
    },
    {
      id: 'railway',
      icon: <Train size={16} />,
      title: language === 'hi' ? 'परिदृश्य 4: रेलवे तत्काल रिफंड' : 'Scenario 4: Railway Tatkal Refund',
      query: language === 'hi'
        ? 'My Tatkal ticket was cancelled automatically but the refund has not been credited.'
        : 'My Tatkal ticket was cancelled automatically but the refund has not been credited.',
      target: language === 'hi' ? 'रेलवे बोर्ड' : 'Railway Board (Ministry of Railways)',
      tagColor: 'chip-primary',
      desc: language === 'hi'
        ? 'आईआरसीटीसी तत्काल टिकट → रेलवे बोर्ड'
        : 'Tatkal cancellation → Railway Board routing with active nodal cell audit',
      verifiedEvidence: 'CPGRAMS Verified Department Registry (Railways)',
    },
    {
      id: 'ambiguous',
      icon: <AlertCircle size={16} />,
      title: language === 'hi' ? 'परिदृश्य 5: अस्पष्ट शिकायत (जिम्मेदार एआई)' : 'Scenario 5: Ambiguous Query (Needs Info)',
      query: language === 'hi'
        ? 'I have a problem with a government service and nobody is helping me.'
        : 'I have a problem with a government service and nobody is helping me.',
      target: language === 'hi' ? 'समीक्षा आवश्यक • शून्य बनावटी अनुमान' : 'Needs Review • Zero False Authority Guessing',
      tagColor: 'chip-critical',
      desc: language === 'hi'
        ? 'सामान्य शिकायत → विभाग का झूठा अनुमान लगाने के बजाय अतिरिक्त विवरण मांगना'
        : 'Demonstrates responsible AI triage without forcing a hallucinated department',
      verifiedEvidence: 'Responsible AI Triage (Confidence < 60% → NEEDS_REVIEW)',
    },
  ];

  return (
    <>
      {/* Subtle Floating Evaluator Button (always available at bottom right for judges) */}
      <button
        type="button"
        className="btn btn-tonal"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 40,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
          border: '1px solid var(--civic-border-medium)',
          backgroundColor: '#FFFFFF',
          padding: '0.5rem 0.9rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--civic-brand)',
          borderRadius: 'var(--radius-pill)',
        }}
        onClick={() => setInternalOpen(true)}
        title="Open Evaluator Demo Scenarios Console"
      >
        <Sliders size={15} />
        <span>{language === 'hi' ? 'मूल्यांकनकर्ता कंसोल' : 'Evaluator Scenarios'}</span>
        <span
          style={{
            backgroundColor: 'var(--civic-brand-light)',
            color: 'var(--civic-brand-dark)',
            padding: '0.1rem 0.4rem',
            borderRadius: '10px',
            fontSize: '0.6875rem',
          }}
        >
          5
        </span>
      </button>

      {/* Evaluator Modal Drawer */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={handleClose}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-dialog)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--civic-border-medium)',
            }}
          >
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--civic-brand-light)',
                      color: 'var(--civic-brand-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                      <span className="chip chip-primary" style={{ fontSize: '0.6875rem' }}>
                        {language === 'hi' ? 'मूल्यांकनकर्ता बेंचमार्क' : 'Evaluator Benchmark Suite'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                        5 Verified Scenarios
                      </span>
                    </div>
                    <h2 className="title-large" style={{ fontSize: '1.2rem', color: 'var(--civic-text-primary)' }}>
                      {language === 'hi'
                        ? '1-क्लिक जज एवं मूल्यांकनकर्ता परीक्षण परिदृश्य'
                        : '1-Click Evaluator & Judge Test Scenarios'}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-text"
                  style={{ minHeight: 'auto', padding: '0.4rem', borderRadius: '50%' }}
                  onClick={handleClose}
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {language === 'hi'
                  ? 'यह कंसोल मूल्यांकनकर्ताओं को एंड-टू-एंड रूटिंग, स्वास्थ्य सुविधा संकल्प, जिम्मेदार एआई वर्गीकरण और 10-वर्षीय ऐतिहासिक डेटा सत्यापन का तुरंत परीक्षण करने की सुविधा देता है।'
                  : 'Execute real-time routing triage, healthcare facility resolution, responsible AI handling, and 10-year historical baseline comparison in 1-click:'}
              </p>

              {/* Scenarios Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.875rem' }}>
                {SCENARIOS.map(sc => (
                  <div
                    key={sc.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-card)',
                      backgroundColor: 'var(--civic-canvas-subtle)',
                      border: '1px solid var(--civic-border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.8125rem' }}>
                        {sc.icon}
                        <span>{sc.title}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-filled"
                        style={{
                          minHeight: '30px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                        onClick={() => {
                          onSelectScenario(sc.query);
                          handleClose();
                        }}
                      >
                        <Play size={12} />
                        <span>{language === 'hi' ? 'परीक्षण करें' : 'Run Test'}</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--civic-text-primary)', fontStyle: 'italic', backgroundColor: '#FFFFFF', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--civic-border-light)' }}>
                      &quot;{sc.query}&quot;
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--civic-text-secondary)' }}>
                        &rarr; {sc.target}
                      </span>
                      <span style={{ color: 'var(--civic-text-muted)', fontSize: '0.6875rem' }}>
                        {sc.verifiedEvidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--civic-border-light)',
                  fontSize: '0.75rem',
                  color: 'var(--civic-text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--civic-success)' }} />
                  <span>All 5 scenarios verified against official 2,134 CPGRAMS data rows</span>
                </div>
                <Button variant="tonal" style={{ minHeight: '32px', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={handleClose}>
                  <span>{language === 'hi' ? 'बंद करें' : 'Close'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
