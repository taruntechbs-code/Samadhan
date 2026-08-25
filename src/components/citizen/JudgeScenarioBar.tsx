/**
 * SAMADHAN — Judge Demo Scenarios & Evaluator Bar (Phase 8)
 * Provides 1-click execution for the 5 official evaluator test scenarios.
 */

import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useTranslation } from '../../i18n';
import { Play, Sparkles, AlertCircle, Train, CreditCard, HeartPulse, FileText } from 'lucide-react';

interface JudgeScenarioBarProps {
  onSelectScenario: (queryText: string) => void;
}

export const JudgeScenarioBar: React.FC<JudgeScenarioBarProps> = ({ onSelectScenario }) => {
  const { language } = useTranslation();

  const SCENARIOS = [
    {
      id: 'epfo',
      icon: <FileText size={16} />,
      title: language === 'hi' ? 'परिदृश्य 1: ईपीएफओ / पेंशन' : 'Scenario 1: EPFO / Pension',
      query: language === 'hi'
        ? 'My pension payment from EPFO has been delayed for two months.'
        : 'My pension payment from EPFO has been delayed for two months.',
      target: language === 'hi' ? 'श्रम एवं रोजगार मंत्रालय' : 'Labour and Employment',
      tagColor: 'chip-primary',
      desc: language === 'hi' ? 'पेंशन विलंब → श्रम मंत्रालय + 10-वर्षीय ऐतिहासिक तुलना' : 'EPFO delay → Labour Ministry + 10-yr baseline',
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
      desc: language === 'hi' ? 'पीएचसी आदोनी कर्नूल का भौगोलिक अधिकार क्षेत्र स्वतः पहचान' : 'Resolves PHC Adoni Rural (Kurnool, AP) geographic jurisdiction',
    },
    {
      id: 'incometax',
      icon: <CreditCard size={16} />,
      title: language === 'hi' ? 'परिदृश्य 3: आयकर रिफंड' : 'Scenario 3: Income Tax Refund',
      query: language === 'hi'
        ? 'My income tax refund is delayed.'
        : 'My income tax refund is delayed.',
      target: language === 'hi' ? 'सीबीडीटी (प्रत्यक्ष कर)' : 'Central Board of Direct Taxes (Income Tax)',
      tagColor: 'chip-primary',
      desc: language === 'hi' ? 'आयकर रिफंड → प्रत्यक्ष कर बोर्ड' : 'ITR refund → CBDT routing with zero facility overhead',
    },
    {
      id: 'railway',
      icon: <Train size={16} />,
      title: language === 'hi' ? 'परिदृश्य 4: रेलवे तत्काल रिफंड' : 'Scenario 4: Railway Tatkal Refund',
      query: language === 'hi'
        ? 'My Tatkal ticket was cancelled automatically but the refund has not been credited.'
        : 'My Tatkal ticket was cancelled automatically but the refund has not been credited.',
      target: language === 'hi' ? 'रेलवे बोर्ड' : 'Railway Board',
      tagColor: 'chip-primary',
      desc: language === 'hi' ? 'आईआरसीटीसी तत्काल टिकट → रेलवे बोर्ड' : 'Tatkal cancellation → Railway Board routing',
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
      desc: language === 'hi' ? 'सामान्य शिकायत → विभाग का झूठा अनुमान लगाने के बजाय अतिरिक्त विवरण मांगना' : 'Demonstrates responsible triage without forcing a false department',
    },
  ];

  return (
    <Card
      variant="standard"
      style={{
        border: '1.5px solid var(--md-sys-color-primary)',
        background: 'linear-gradient(135deg, #FAF7FD 0%, #FFFFFF 100%)',
        boxShadow: '0 4px 14px rgba(103, 80, 164, 0.08)',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
              {language === 'hi' ? 'मूल्यांकनकर्ता डेमो परिदृश्य • Explore SAMADHAN' : 'Explore SAMADHAN • Evaluator Demo Scenarios'}
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {language === 'hi'
                ? 'जज एवं मूल्यांकनकर्ता 1-क्लिक में 5 मुख्य परिदृश्यों का प्रत्यक्ष परीक्षण कर सकते हैं'
                : 'Judges & Evaluators: 1-click test of end-to-end routing, facility resolution, and responsible AI triage'}
            </p>
          </div>
        </div>

        <Badge type="primary">
          <span>{language === 'hi' ? '5 जज परिदृश्य' : '5 Judge Scenarios'}</span>
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
        {SCENARIOS.map(sc => (
          <button
            key={sc.id}
            type="button"
            className="btn"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--md-sys-color-outline-variant)',
              boxShadow: 'var(--shadow-level-1)',
              cursor: 'pointer',
              minHeight: '85px',
              transition: 'all 0.15s ease',
            }}
            onClick={() => onSelectScenario(sc.query)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--md-sys-color-primary)' }}>
                {sc.icon}
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {sc.title}
                </span>
              </div>
              <Play size={12} style={{ color: 'var(--md-sys-color-primary)' }} />
            </div>

            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', marginBottom: '0.2rem' }}>
              &rarr; {sc.target}
            </div>

            <div style={{ fontSize: '0.6875rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.3 }}>
              {sc.desc}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
