import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { routeGrievance } from '../../services/apiClient';
import { RoutingRecommendation } from '../../intelligence/types';
import { Mic, Send, Sparkles, Building2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface GrievanceInputHeroProps {
  onOpenSubmitModal: (recommendation: RoutingRecommendation, grievanceText: string) => void;
}

const QUICK_STARTERS = [
  'Income tax refund for AY 2025-26 is still not credited to my bank account',
  'EPFO PF balance transfer request from previous employer rejected without reason',
  'Cash debited from ATM but bank machine failed to dispense money',
  'IRCTC train tatkal ticket was cancelled automatically but refund pending',
  'Electricity voltage fluctuation and frequent power cut in residential area',
  'Passport reissue application stuck at verification stage for over a month',
];

export const GrievanceInputHero: React.FC<GrievanceInputHeroProps> = ({ onOpenSubmitModal }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [routingResult, setRoutingResult] = useState<RoutingRecommendation | null>(null);

  // Auto-route on text change after small debounce
  useEffect(() => {
    if (!text.trim() || text.trim().length < 8) {
      setRoutingResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsRouting(true);
      try {
        const result = await routeGrievance(text);
        setRoutingResult(result);
      } catch (err) {
        console.error('Routing error:', err);
      } finally {
        setIsRouting(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text]);

  const handleMicClick = () => {
    setIsListening(true);
    // Simulate natural voice recognition prompt
    setTimeout(() => {
      setText('My ITR income tax refund of ₹18,500 has been delayed for the past 4 months after e-verification.');
      setIsListening(false);
    }, 1200);
  };

  const handleQuickStarter = (starter: string) => {
    setText(starter);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header Section */}
      <Card variant="hero" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <Badge type="primary" className="chip-primary">
          <Sparkles size={14} />
          <span>AI-Powered Citizen Redressal Assistant</span>
        </Badge>

        <h1 className="display-large" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', maxWidth: '820px' }}>
          Tell us your problem. <br />
          <span style={{ color: 'var(--md-sys-color-primary)' }}>We’ll find the right department.</span>
        </h1>

        <p className="body-large" style={{ maxWidth: '640px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Citizens should not need to understand government bureaucracy, ministry hierarchies, or administrative codes to receive prompt resolution.
        </p>

        {/* Natural Language Grievance Text Input */}
        <div style={{ width: '100%', maxWidth: '780px', marginTop: '0.75rem', position: 'relative' }}>
          <div className="input-container">
            <textarea
              className="input-filled textarea-filled"
              style={{
                fontSize: '1.0625rem',
                minHeight: '140px',
                padding: '1.25rem 1.5rem',
                paddingBottom: '3.75rem',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-level-1)',
              }}
              placeholder="Describe what happened in simple everyday words... (e.g. 'My pension payment has been delayed for 2 months by EPFO')"
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
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              type="button"
              className="btn btn-text"
              style={{
                fontSize: '0.8125rem',
                padding: '0.4rem 0.75rem',
                color: isListening ? 'var(--md-sys-color-risk-critical)' : 'var(--md-sys-color-primary)',
              }}
              onClick={handleMicClick}
              title="Voice Speech-to-Text Input"
            >
              <Mic size={18} />
              <span>{isListening ? 'Listening to voice...' : 'Speak Problem'}</span>
            </button>

            {routingResult && routingResult.recommendedEntity && (
              <Button
                variant="filled"
                style={{ minHeight: '40px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                onClick={() => onOpenSubmitModal(routingResult, text)}
              >
                <span>Proceed with Grievance</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Example Starters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '780px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', alignSelf: 'center', marginRight: '0.25rem' }}>
            Popular topics:
          </span>
          {QUICK_STARTERS.map((qs, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-tonal"
              style={{ minHeight: '34px', padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              onClick={() => handleQuickStarter(qs)}
            >
              {qs.split(' ')[0]} {qs.split(' ')[1]} {qs.split(' ')[2]}...
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
                }}
              >
                <Building2 size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <Badge type="primary">
                    <CheckCircle2 size={12} />
                    <span>{isRouting ? 'Analyzing Jurisdiction...' : 'Auto-Identified Destination'}</span>
                  </Badge>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
                    {Math.round(routingResult.confidence * 100)}% Match Confidence
                  </span>
                </div>

                <h2 className="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                  {routingResult.recommendedEntity}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                  Category: <strong>{routingResult.detectedCategory}</strong> &bull; {routingResult.matchReason}
                </p>
              </div>
            </div>

            <Button
              variant="filled"
              onClick={() => onOpenSubmitModal(routingResult, text)}
            >
              <span>Lodge Grievance to this Authority</span>
              <Send size={16} />
            </Button>
          </div>

          {/* Alternative Candidates */}
          {routingResult.alternativeCandidates.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--md-sys-color-surface-container-low)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Alternative Jurisdiction Candidates:
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

          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--md-sys-color-outline)' }}>
            <ShieldCheck size={14} />
            <span>{routingResult.disclaimer}</span>
          </div>
        </Card>
      )}
    </div>
  );
};
