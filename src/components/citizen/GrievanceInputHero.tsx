import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { routeGrievance } from '../../services/apiClient';
import { RoutingRecommendation } from '../../intelligence/types';
import { useTranslation } from '../../i18n';
import { FacilityContextCard } from './FacilityContextCard';
import { Mic, Send, Sparkles, Building2, CheckCircle2, ArrowRight, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

interface GrievanceInputHeroProps {
  onOpenSubmitModal: (recommendation: RoutingRecommendation, grievanceText: string) => void;
  externalQuery?: string;
}

export const GrievanceInputHero: React.FC<GrievanceInputHeroProps> = ({
  onOpenSubmitModal,
  externalQuery,
}) => {
  const { t, language } = useTranslation();
  const [text, setText] = useState(externalQuery || '');
  const [isListening, setIsListening] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [routingStage, setRoutingStage] = useState<'idle' | 'understanding' | 'analyzing' | 'matched'>('idle');
  const [routingResult, setRoutingResult] = useState<RoutingRecommendation | null>(null);

  const QUICK_STARTERS = language === 'hi'
    ? [
        'आयकर रिटर्न रिफंड 2025-26 ई-सत्यापन के बाद भी खाते में जमा नहीं हुआ',
        'ईपीएफओ (EPFO) भविष्य निधि बैलेंस ट्रांसफर का अनुरोध बिना कारण निरस्त किया गया',
        'एटीएम मशीन से नकदी नहीं निकली लेकिन बैंक खाते से पैसे कट गए',
        'आईआरसीटीसी ट्रेन तत्काल टिकट रद्द हुआ पर रिफंड अभी तक लंबित है',
        'आवासीय क्षेत्र में बिजली की वोल्टेज में उतार-चढ़ाव और बार-बार कटौती',
        'पासपोर्ट नवीनीकरण आवेदन एक महीने से सत्यापन चरण में अटका है',
      ]
    : [
        'Income tax refund for AY 2025-26 is still not credited to my bank account',
        'EPFO PF balance transfer request from previous employer rejected without reason',
        'Cash debited from ATM but bank machine failed to dispense money',
        'IRCTC train tatkal ticket was cancelled automatically but refund pending',
        'Electricity voltage fluctuation and frequent power cut in residential area',
        'Passport reissue application stuck at verification stage for over a month',
      ];

  useEffect(() => {
    if (externalQuery) {
      setText(externalQuery);
    }
  }, [externalQuery]);

  // Auto-route on text change with interactive progression
  useEffect(() => {
    if (!text.trim() || text.trim().length < 8) {
      setRoutingResult(null);
      setRoutingStage('idle');
      return;
    }

    setIsRouting(true);
    setRoutingStage('understanding');

    const step1 = setTimeout(() => {
      setRoutingStage('analyzing');
    }, 250);

    const step2 = setTimeout(async () => {
      try {
        const result = await routeGrievance(text);
        setRoutingResult(result);
        setRoutingStage('matched');
      } catch (err) {
        console.error('Routing error:', err);
      } finally {
        setIsRouting(false);
      }
    }, 550);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
    };
  }, [text]);

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setText(
        language === 'hi'
          ? 'मेरा आयकर (ITR) रिफंड ₹18,500 ई-सत्यापन के बाद पिछले 4 महीनों से लंबित है।'
          : 'My ITR income tax refund of ₹18,500 has been delayed for the past 4 months after e-verification.'
      );
      setIsListening(false);
    }, 1100);
  };

  const handleQuickStarter = (starter: string) => {
    setText(starter);
  };

  const handleReset = () => {
    setText('');
    setRoutingResult(null);
    setRoutingStage('idle');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header Section */}
      <Card variant="hero" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <Badge type="primary">
          <Sparkles size={14} />
          <span>{t('hero.badge')}</span>
        </Badge>

        <h1 className="display-large" style={{ maxWidth: '840px' }}>
          {t('hero.titleMain')} <br />
          <span style={{ color: 'var(--md-sys-color-primary)' }}>{t('hero.titleSub')}</span>
        </h1>

        <p className="body-large" style={{ maxWidth: '640px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t('hero.subtitle')}
        </p>

        {/* Natural Language Grievance Text Input */}
        <div style={{ width: '100%', maxWidth: '780px', marginTop: '0.75rem', position: 'relative' }}>
          <div className="input-container">
            <textarea
              className="input-filled textarea-filled"
              style={{
                fontSize: '1rem',
                minHeight: '140px',
                padding: '1.25rem',
                paddingBottom: '4rem',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(103, 80, 164, 0.08)',
              }}
              placeholder={t('hero.placeholder')}
              value={text}
              onChange={e => setText(e.target.value)}
              aria-label="Describe your grievance in simple words"
            />
          </div>

          {/* Action Bar inside/below Textarea */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '14px',
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                className="btn btn-text"
                style={{
                  fontSize: '0.8125rem',
                  padding: '0.35rem 0.65rem',
                  color: isListening ? 'var(--md-sys-color-risk-critical)' : 'var(--md-sys-color-primary)',
                }}
                onClick={handleMicClick}
                title="Voice Speech-to-Text Input"
              >
                <Mic size={18} />
                <span>{isListening ? t('hero.listening') : t('hero.speakBtn')}</span>
              </button>

              {text && (
                <button
                  type="button"
                  className="btn btn-text"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}
                  onClick={handleReset}
                >
                  <RefreshCw size={14} />
                  <span>{t('hero.clearBtn')}</span>
                </button>
              )}
            </div>

            {routingResult && routingResult.recommendedEntity && (
              <Button
                variant="filled"
                style={{ minHeight: '38px', padding: '0.4rem 1.1rem', fontSize: '0.8125rem' }}
                onClick={() => onOpenSubmitModal(routingResult, text)}
              >
                <span>{t('hero.proceedBtn')}</span>
                <ArrowRight
                  size={18}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </div>

        {/* Intelligent Step State Transition Indicator */}
        {isRouting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
            <Cpu size={16} className="spin" />
            <span>
              {routingStage === 'understanding' ? t('hero.step1') : t('hero.step2')}
            </span>
          </div>
        )}

        {/* Quick Example Starters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '780px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', alignSelf: 'center', marginRight: '0.25rem' }}>
            {t('hero.popularTopics')}
          </span>
          {QUICK_STARTERS.map((qs, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-tonal"
              style={{ minHeight: '34px', padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              onClick={() => handleQuickStarter(qs)}
            >
              {qs.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>
      </Card>

      {/* Real-Time Intelligent Routing Preview Card */}
      {routingResult && routingResult.recommendedEntity && (
        <Card variant="standard" style={{ border: '1.5px solid var(--md-sys-color-primary-container)', background: '#FAF7FD' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <Badge type="primary">
                    <CheckCircle2 size={12} />
                    <span>{t('hero.autoMatched')}</span>
                  </Badge>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
                    {Math.round(routingResult.confidence * 100)}% {t('hero.prototypeConfidence')}
                  </span>
                </div>

                <h2 className="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                  {routingResult.recommendedEntity}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                  <strong>{routingResult.detectedCategory}</strong> &bull; {routingResult.matchReason}
                </p>
              </div>
            </div>

            <Button
              variant="filled"
              onClick={() => onOpenSubmitModal(routingResult, text)}
            >
              <span>{t('hero.lodgeToAuthority')}</span>
              <Send
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </Button>
          </div>

          {/* Alternative Candidates */}
          {routingResult.alternativeCandidates.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--md-sys-color-border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('hero.altCandidates')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {routingResult.alternativeCandidates.map((alt, idx) => (
                  <span
                    key={idx}
                    className="chip chip-secondary"
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
                  >
                    {alt.entity} ({Math.round(alt.confidence * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facility Directory Enrichment Context (when Healthcare detected) */}
          {routingResult.facilityContextAvailable && (
            <FacilityContextCard
              queryText={text}
              facilityDomain={routingResult.facilityDomain}
            />
          )}

          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--md-sys-color-outline)' }}>
              <ShieldCheck size={14} />
              <span>{routingResult.disclaimer}</span>
            </div>

            <EvidenceBadge
              evidence={{
                dataset: 'live_dashboard_2026',
                entity: routingResult.recommendedEntity,
                metric: 'target_authority_mapping',
                value: routingResult.detectedCategory,
                period: '2026-01-01 to 2026-08-24',
                sourceUrl: 'https://pgportal.gov.in/darpgdashboard',
                sourceNote: 'Entity catalogued in DARPG official master registry.',
              }}
              label={t('hero.sourceVerified')}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
