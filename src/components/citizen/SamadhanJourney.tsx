import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
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
  const STEPS = [
    { num: '01', title: 'Citizen Expresses Need', desc: 'Natural language input in everyday words without knowing ministry hierarchies.', icon: <MessageSquare size={18} /> },
    { num: '02', title: 'Intent Understanding', desc: 'Real-time parsing of grievance domain, keywords, and jurisdiction scope.', icon: <Cpu size={18} /> },
    { num: '03', title: 'Intelligent Routing', desc: 'Mapped to 278 real public authorities with calibrated confidence scoring.', icon: <Building2 size={18} /> },
    { num: '04', title: 'Grievance Lodging', desc: 'Immediate generation of tracking ID (SAM-2026-XXXX) and nodal officer dispatch.', icon: <FileCheck size={18} /> },
    { num: '05', title: 'Transparent Tracking', desc: 'Citizen views step-by-step progress, timeline stages, and SLA countdown.', icon: <Search size={18} /> },
    { num: '06', title: 'National Telemetry', desc: 'Government intelligence cockpit aggregates 2.17M+ cases into live KPIs.', icon: <Activity size={18} /> },
    { num: '07', title: 'Bottleneck Triage', desc: 'Deterministic risk engine flags departments trailing operational benchmarks.', icon: <ShieldAlert size={18} /> },
    { num: '08', title: 'Actionable Guidance', desc: 'Targeted operational recommendations backed by verifiable source evidence.', icon: <Lightbulb size={18} /> },
  ];

  const BEFORE_AFTER = [
    {
      aspect: 'Authority Discovery',
      before: 'Citizen must navigate complex ministry lists, attached offices, and nodal hierarchy codes.',
      after: 'Citizen describes problem in natural language; SAMADHAN auto-identifies the target authority.',
    },
    {
      aspect: 'Status Visibility',
      before: 'Opaque status messages ("Pending with officer") with little context on aging or SLA.',
      after: 'Visual multi-stage progress timeline with SLA guarantees and nodal cell transparency.',
    },
    {
      aspect: 'Administrative Dashboard',
      before: 'Raw uninterpreted tabular counts without proactive bottleneck detection.',
      after: 'National Pulse cockpit with explainable risk scores (0–100) and prioritized actions.',
    },
    {
      aspect: 'Operational Guidance',
      before: 'Generic directives ("dispose faster") without causal evidence.',
      after: 'Concrete recommendations (e.g. "prioritize 180–365d queue") tied directly to metric triggers.',
    },
  ];

  const DEMO_SCENARIOS = [
    {
      title: 'Scenario A: Delayed EPFO Pension Transfer',
      text: 'My previous employer EPFO provident fund transfer of ₹78,000 has been stuck in review for 3 months without reason.',
      tag: 'Labour & Employment',
    },
    {
      title: 'Scenario B: Income Tax Refund AY 2025-26',
      text: 'ITR-1 filed and e-verified on June 2025. Tax refund of ₹16,400 with interest has not been issued to my account.',
      tag: 'Income Tax (CBDT)',
    },
    {
      title: 'Scenario C: Fastag Highway Toll Double Deduction',
      text: 'National highway toll plaza deducted toll fare twice from my Fastag account within 5 minutes at Panipat plaza.',
      tag: 'Road Transport & NHAI',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 8-Step Complete Journey */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Badge type="primary">
            <Sparkles size={12} />
            <span>End-to-End Architecture</span>
          </Badge>
          <h2 className="headline-large" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)' }}>
            The SAMADHAN Closed-Loop Experience
          </h2>
          <p className="body-medium" style={{ maxWidth: '620px', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Connecting everyday citizen challenges directly to high-precision government operational response.
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
            Transformational Paradigm
          </span>
          <h3 className="title-large" style={{ fontSize: '1.5rem' }}>
            Redesigning India’s Grievance Experience
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
                  <strong style={{ color: 'var(--md-sys-color-risk-critical)' }}>Traditional: </strong>
                  {item.before}
                </div>
              </div>

              {/* After */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--md-sys-color-risk-low)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--md-sys-color-risk-low)' }}>SAMADHAN: </strong>
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
                Live Evaluator Demo Scenarios
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Click any realistic citizen scenario to immediately test natural routing and submission:
              </p>
            </div>
            <Badge type="primary">
              <span>Interactive Demonstration</span>
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.875rem' }}>
            {DEMO_SCENARIOS.map((sc, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '1px solid var(--md-sys-color-surface-container-low)',
                }}
                onClick={() => onTriggerScenario(sc.text)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                    {sc.tag}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Play size={12} />
                    <span>Run Scenario</span>
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
