import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { GrievanceTimeline } from '../components/citizen/GrievanceTimeline';
import { getGrievanceByRef, getStoredCitizenGrievances, CitizenGrievanceRecord } from '../../src/services/apiClient';
import { useTranslation } from '../i18n';
import {
  Search,
  Building2,
  ShieldCheck,
  AlertCircle,
  Info,
  Clock,
  Calendar,
  User
} from 'lucide-react';

export const TrackPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || 'SAM-2026-1042';

  const [query, setQuery] = useState(initialRef);
  const [record, setRecord] = useState<CitizenGrievanceRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleList = getStoredCitizenGrievances().slice(0, 3);

  const handleSearch = (refId: string) => {
    setHasSearched(true);
    setSearchParams({ ref: refId.trim() });
    const found = getGrievanceByRef(refId);
    setRecord(found);
  };

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '860px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* Header & Search Bar */}
      <div
        className="card-surface"
        style={{
          border: '1px solid var(--civic-border-medium)',
          backgroundColor: '#FFFFFF',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'var(--civic-brand-light)', color: 'var(--civic-brand-dark)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 700 }}>
          <Clock size={14} />
          <span>{language === 'hi' ? 'वास्तविक समय शिकायत स्थिति ट्रैकिंग' : 'Official Status Tracking'}</span>
        </div>

        <h1 className="headline-large" style={{ color: 'var(--civic-text-primary)', margin: 0 }}>
          {language === 'hi' ? 'अपनी शिकायत की स्थिति ट्रैक करें' : 'Track Your Grievance'}
        </h1>
        <p className="body-medium" style={{ color: 'var(--civic-text-secondary)', maxWidth: '580px', margin: 0 }}>
          {language === 'hi'
            ? 'नोडल अधिकारी असाइनमेंट, समयसीमा और निवारण चरणों को देखने के लिए अपना संदर्भ नंबर दर्ज करें।'
            : 'Enter your registration reference number to inspect assigned nodal cell, SLA countdown, and resolution progress.'}
        </p>

        {/* Search Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '540px', marginTop: '0.5rem' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              required
              className="input-filled"
              style={{
                minHeight: '46px',
                paddingLeft: '2.5rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
              placeholder="e.g. SAM-2026-1042"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--civic-text-muted)' }} />
          </div>

          <Button type="submit" variant="filled" style={{ minHeight: '46px', padding: '0.5rem 1.25rem' }}>
            <span>{language === 'hi' ? 'स्थिति खोजें' : 'Track Status'}</span>
          </Button>
        </form>

        {/* Quick Sample Reference Chips */}
        {sampleList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
              {language === 'hi' ? 'नमूना संदर्भ:' : 'Sample references:'}
            </span>
            {sampleList.map(s => (
              <button
                key={s.id}
                type="button"
                className="chip chip-secondary"
                style={{ cursor: 'pointer', border: '1px solid var(--civic-border-light)', fontSize: '0.75rem' }}
                onClick={() => {
                  setQuery(s.id);
                  handleSearch(s.id);
                }}
              >
                {s.id} ({s.category.split(' ')[0]})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lookup Result Card */}
      {record ? (
        <div
          className="card-surface"
          style={{
            border: '1px solid var(--civic-border-medium)',
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Top Banner */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--civic-border-light)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--civic-brand)', letterSpacing: '0.04em' }}>
                  {record.id}
                </span>
                <Badge status={record.status} />
                <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                  Demo Citizen Record
                </span>
              </div>
              <h2 className="title-large" style={{ fontSize: '1.15rem', color: 'var(--civic-text-primary)' }}>
                {record.title}
              </h2>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                <Calendar size={13} style={{ color: 'var(--civic-text-muted)' }} />
                <span>{language === 'hi' ? 'दर्ज तिथि:' : 'Submitted:'} <strong>{record.submittedAt}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                <User size={13} style={{ color: 'var(--civic-text-muted)' }} />
                <span>{language === 'hi' ? 'आवेदक:' : 'Applicant:'} <strong>{record.applicantName}</strong></span>
              </div>
            </div>
          </div>

          {/* Assigned Authority Box */}
          <div
            style={{
              backgroundColor: 'var(--civic-canvas-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              border: '1px solid var(--civic-border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--civic-brand-light)',
                  color: 'var(--civic-brand-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7125rem', color: 'var(--civic-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {language === 'hi' ? 'आबंटित प्राधिकरण / निवारण सेल' : 'Assigned Public Authority'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--civic-text-primary)' }}>
                  {record.routedEntity}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.75rem' }}>
                {record.category}
              </span>
              <EvidenceBadge
                evidence={{
                  dataset: 'live_dashboard_2026',
                  entity: record.routedEntity,
                  metric: 'grievance_redressal_cell',
                  value: 'Active Nodal Cell',
                  period: '2026-01-01 to 2026-08-24',
                  sourceUrl: 'https://pgportal.gov.in/darpgdashboard',
                  sourceNote: 'Entity active in official CPGRAMS central live telemetry.',
                }}
                label={language === 'hi' ? 'सत्यापित सेल' : 'Verified Nodal Cell'}
              />
            </div>
          </div>

          {/* Grievance Statement */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--civic-border-light)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--civic-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'शिकायत का विवरण:' : 'Grievance Description:'}
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-primary)', marginTop: '0.35rem', lineHeight: 1.55 }}>
              {record.description}
            </p>
          </div>

          {/* Visual Redressal Timeline */}
          <div>
            <h3 className="title-medium" style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'निवारण जीवनचक्र एवं प्रगति' : 'Redressal Lifecycle & Milestone Progress'}
            </h3>
            <GrievanceTimeline items={record.timeline} />
          </div>

          {/* SLA Standard Notice */}
          <div
            style={{
              borderTop: '1px solid var(--civic-border-light)',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--civic-text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--civic-success)', flexShrink: 0 }} />
              <span>Standard DARPG Citizen Charter SLA: Targeted for resolution within 30 operational days.</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
              <Info size={13} />
              <span>Independent civic-tech demo simulation</span>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* Not Found State */
        <div className="card-surface" style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={40} style={{ color: 'var(--civic-danger)' }} />
          <div>
            <h3 className="title-large">{t('track.notFoundTitle')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-muted)', marginTop: '0.25rem' }}>
              {t('track.notFoundDesc')}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
