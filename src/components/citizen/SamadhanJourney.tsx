import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useTranslation } from '../../i18n';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Cpu,
  Building2,
  FileCheck,
  Search,
  Activity,
  ShieldAlert,
  Lightbulb,
  Play,
} from 'lucide-react';

export interface SamadhanJourneyProps {
  onTriggerScenario?: (query: string) => void;
}

export const SamadhanJourney: React.FC<SamadhanJourneyProps> = ({ onTriggerScenario }) => {
  const { t, language } = useTranslation();

  const STEPS = [
    { num: '01', title: t('journey.step1Title'), desc: t('journey.step1Desc'), icon: <MessageSquare size={18} /> },
    { num: '02', title: t('journey.step2Title'), desc: t('journey.step2Desc'), icon: <Cpu size={18} /> },
    { num: '03', title: t('journey.step3Title'), desc: t('journey.step3Desc'), icon: <Building2 size={18} /> },
    { num: '04', title: t('journey.step4Title'), desc: t('journey.step4Desc'), icon: <FileCheck size={18} /> },
    { num: '05', title: t('journey.step5Title'), desc: t('journey.step5Desc'), icon: <Search size={18} /> },
    { num: '06', title: t('journey.step6Title'), desc: t('journey.step6Desc'), icon: <Activity size={18} /> },
    { num: '07', title: t('journey.step7Title'), desc: t('journey.step7Desc'), icon: <ShieldAlert size={18} /> },
    { num: '08', title: t('journey.step8Title'), desc: t('journey.step8Desc'), icon: <Lightbulb size={18} /> },
  ];

  const BEFORE_AFTER = [
    { aspect: t('journey.aspect1'), before: t('journey.before1'), after: t('journey.after1') },
    { aspect: t('journey.aspect2'), before: t('journey.before2'), after: t('journey.after2') },
    { aspect: t('journey.aspect3'), before: t('journey.before3'), after: t('journey.after3') },
    { aspect: t('journey.aspect4'), before: t('journey.before4'), after: t('journey.after4') },
  ];

  const DEMO_SCENARIOS = language === 'hi'
    ? [
        {
          title: 'परिदृश्य A: विलंबित ईपीएफओ (EPFO) पेंशन ट्रांसफर',
          text: 'मेरी पिछली कंपनी से ईपीएफओ भविष्य निधि ट्रांसफर ₹78,000 पिछले 3 महीने से बिना कारण समीक्षा में अटका हुआ है।',
          tag: 'श्रम एवं रोजगार मंत्रालय',
        },
        {
          title: 'परिदृश्य B: आयकर रिफंड निर्धारण वर्ष 2025-26',
          text: 'आईटीआर जून 2025 में दाखिल और ई-सत्यापित किया गया। ₹16,400 का आयकर रिफंड ब्याज सहित अभी तक मेरे बैंक खाते में जारी नहीं हुआ।',
          tag: 'केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT)',
        },
        {
          title: 'परिदृश्य C: फास्टैग राष्ट्रीय राजमार्ग पर दोहरा टोल शुल्क कटौती',
          text: 'पानीपत राष्ट्रीय राजमार्ग टोल प्लाजा पर 5 मिनट के भीतर मेरे फास्टैग खाते से दो बार टोल शुल्क काटा गया।',
          tag: 'सड़क परिवहन एवं राजमार्ग',
        },
      ]
    : [
        {
          title: 'Scenario A: Delayed EPFO Pension Transfer',
          text: 'My previous employer EPFO provident fund transfer of ₹78,000 has been stuck in review for 3 months without reason.',
          tag: 'Labour and Employment',
        },
        {
          title: 'Scenario B: Income Tax Refund AY 2025-26',
          text: 'ITR-1 filed and e-verified on June 2025. Tax refund of ₹16,400 with interest has not been issued to my account.',
          tag: 'Income Tax (CBDT)',
        },
        {
          title: 'Scenario C: Fastag Highway Toll Double Deduction',
          text: 'National highway toll plaza deducted toll fare twice from my Fastag account within 5 minutes at Panipat plaza.',
          tag: 'Road Transport & Highways',
        },
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 8-Step Complete Journey */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Badge type="primary">
            <Sparkles size={12} />
            <span>{t('journey.badge')}</span>
          </Badge>
          <h2 className="headline-large" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}>
            {t('journey.title')}
          </h2>
          <p className="body-medium" style={{ maxWidth: '620px', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t('journey.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {STEPS.map((step, idx) => (
            <Card
              key={idx}
              variant="low"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--md-sys-color-primary)', opacity: 0.6 }}>
                  {step.num}
                </span>
              </div>

              <h4 className="title-medium" style={{ fontSize: '1rem', color: 'var(--md-sys-color-on-surface)' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.45 }}>
                {step.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Before vs After Civic Transformation */}
      <Card variant="standard" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <span className="chip chip-primary" style={{ fontSize: '0.75rem' }}>
            {t('journey.paradigmBadge')}
          </span>
          <h3 className="title-large" style={{ fontSize: '1.4rem' }}>
            {t('journey.paradigmTitle')}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {BEFORE_AFTER.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                {item.aspect}
              </span>

              {/* Before */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <XCircle size={16} style={{ color: 'var(--md-sys-color-risk-critical)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--md-sys-color-risk-critical)' }}>
                    {language === 'hi' ? 'पारंपरिक प्रणाली: ' : 'Traditional: '}
                  </strong>
                  {item.before}
                </div>
              </div>

              {/* After */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--md-sys-color-risk-low)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--md-sys-color-risk-low)' }}>
                    {language === 'hi' ? 'समाधान: ' : 'SAMADHAN: '}
                  </strong>
                  {item.after}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* One-Click Interactive Demo Scenarios */}
      {onTriggerScenario && (
        <Card variant="standard" style={{ border: '1.5px dashed var(--md-sys-color-primary)', backgroundColor: '#FCF9FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h3 className="title-large" style={{ fontSize: '1.25rem', color: 'var(--md-sys-color-primary)' }}>
                {t('journey.scenariosTitle')}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t('journey.scenariosDesc')}
              </p>
            </div>
            <Badge type="primary">
              <span>{t('journey.scenariosBadge')}</span>
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.875rem' }}>
            {DEMO_SCENARIOS.map((sc, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '1px solid var(--md-sys-color-border-subtle)',
                }}
                onClick={() => onTriggerScenario(sc.text)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                    {sc.tag}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Play size={12} />
                    <span>{t('journey.runScenario')}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                  {sc.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
                  &quot;{sc.text}&quot;
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
