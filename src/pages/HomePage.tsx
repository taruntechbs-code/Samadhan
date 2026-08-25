import React, { useState } from 'react';
import { GrievanceInputHero } from '../components/citizen/GrievanceInputHero';
import { GrievanceSubmitModal } from '../components/citizen/GrievanceSubmitModal';
import { RoutingRecommendation } from '../intelligence/types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Search,
  Zap,
  CreditCard,
  Train,
  FileText,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRouting, setSelectedRouting] = useState<RoutingRecommendation | null>(null);
  const [grievanceText, setGrievanceText] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleOpenSubmit = (routing: RoutingRecommendation, text: string) => {
    setSelectedRouting(routing);
    setGrievanceText(text);
    setIsSubmitModalOpen(true);
  };

  const CATEGORIES = [
    { title: 'Income Tax & TDS', icon: <CreditCard size={20} />, query: 'Income tax return refund delayed for 6 months after e-verification' },
    { title: 'Railways & IRCTC', icon: <Train size={20} />, query: 'Tatkal ticket cancelled automatically but refund not credited to account' },
    { title: 'EPFO & Pension', icon: <FileText size={20} />, query: 'EPFO transfer of provident fund balance from previous company rejected' },
    { title: 'Banking & UPI', icon: <Zap size={20} />, query: 'ATM transaction failed and cash debited from my savings bank account' },
    { title: 'Electricity & Power', icon: <Lightbulb size={20} />, query: 'Frequent voltage fluctuation and electric meter faulty in my area' },
    { title: 'Health & Hospitals', icon: <HeartPulse size={20} />, query: 'Hospital refused Ayushman Bharat health insurance scheme admission' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '2rem' }}>
      {/* Hero Section */}
      <GrievanceInputHero onOpenSubmitModal={handleOpenSubmit} />

      {/* How SAMADHAN Works */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', alignItems: 'center' }}>
        <Badge type="primary">
          <span>Seamless 3-Step Redressal</span>
        </Badge>
        <h2 className="headline-large" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)' }}>
          How SAMADHAN Solves Civic Grievances
        </h2>
        <p className="body-medium" style={{ maxWidth: '580px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          A modern interface that bridges the gap between everyday citizen issues and specialized government jurisdictions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '1rem' }}>
          <Card variant="standard" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              1
            </div>
            <h3 className="title-medium">Express in Everyday Words</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Type or speak your problem freely. No need to know ministry acronyms, nodal codes, or administrative hierarchies.
            </p>
          </Card>

          <Card variant="standard" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                color: 'var(--md-sys-color-on-secondary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              2
            </div>
            <h3 className="title-medium">Intelligent Authority Routing</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Our routing engine matches your grievance against 278 real public authorities with verified jurisdictional precision.
            </p>
          </Card>

          <Card variant="standard" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                color: 'var(--md-sys-color-on-tertiary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              3
            </div>
            <h3 className="title-medium">Transparent Live Tracking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Receive an official reference number (SAM-2026-XXXX) with step-by-step progress, officer assignment, and SLA timers.
            </p>
          </Card>
        </div>
      </div>

      {/* Quick Category Starters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="title-large">Frequently Lodged Categories</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Select a category to pre-fill an AI grievance query
            </p>
          </div>
          <Button variant="tonal" onClick={() => navigate('/track')}>
            <Search size={16} />
            <span>Track Existing Grievance</span>
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {CATEGORIES.map((cat, idx) => (
            <Card
              key={idx}
              variant="low"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                handleOpenSubmit(
                  {
                    queryText: cat.query,
                    detectedCategory: cat.title,
                    recommendedEntity: cat.title.includes('Income') ? 'Central Board of Direct Taxes (Income Tax)' : cat.title.includes('Rail') ? 'Railway Board' : 'Labour and Employment',
                    confidence: 0.88,
                    matchReason: `Auto-categorized under ${cat.title}`,
                    alternativeCandidates: [],
                    disclaimer: 'Prototype routing — not an official CPGRAMS routing decision.',
                  },
                  cat.query
                );
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cat.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--md-sys-color-on-surface)' }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Click to lodge
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Submission Dialog Modal */}
      <GrievanceSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        routing={selectedRouting}
        grievanceText={grievanceText}
      />
    </div>
  );
};
