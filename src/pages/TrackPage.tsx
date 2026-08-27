import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GrievanceTimeline } from '../components/citizen/GrievanceTimeline';
import { getGrievanceByRef, getStoredCitizenGrievances, CitizenGrievanceRecord } from '../services/apiClient';
import { useTranslation } from '../i18n';
import {
  Search,
  Building2,
  ShieldCheck,
  AlertCircle,
  Info,
  Clock,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';

export const TrackPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

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
          <span>{language === 'hi' ? 'आधिकारिक CPGRAMS ट्रैकिंग' : 'OFFICIAL CPGRAMS TRACKING'}</span>
        </div>

        <h1 className="headline-large" style={{ color: 'var(--civic-text-primary)', margin: 0 }}>
          {language === 'hi' ? 'आधिकारिक CPGRAMS पर स्थिति देखें' : 'Track on Official CPGRAMS'}
        </h1>
        <p className="body-medium" style={{ color: 'var(--civic-text-secondary)', maxWidth: '580px', margin: 0 }}>
          {language === 'hi'
            ? 'समाधान आधिकारिक CPGRAMS स्थिति प्राप्त नहीं कर सकता। अपने CPGRAMS पंजीकरण नंबर का उपयोग आधिकारिक पोर्टल पर करें।'
            : 'SAMADHAN cannot retrieve official CPGRAMS status. Use your CPGRAMS registration number on the official portal.'}
        </p>

        <a
          className="btn btn-filled"
          href="https://pgportal.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ minHeight: '46px', padding: '0.65rem 1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>{language === 'hi' ? 'आधिकारिक CPGRAMS ट्रैकिंग खोलें' : 'Open Official CPGRAMS Tracking'}</span>
          <ExternalLink size={16} />
        </a>

        <div style={{ width: '100%', borderTop: '1px solid var(--civic-border-light)', paddingTop: '1rem', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)' }}>
          <strong>{language === 'hi' ? 'पुराने समाधान डेमो रिकॉर्ड की खोज' : 'Legacy SAMADHAN demo record lookup'}</strong>
          <div>{language === 'hi' ? 'ये रिकॉर्ड CPGRAMS को प्रस्तुत नहीं किए गए थे।' : 'These records were not submitted to CPGRAMS.'}</div>
        </div>

        {/* Search Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '540px', marginTop: '0.5rem', flexWrap: 'wrap' }}
        >
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <input
              type="text"
              required
              className="input-filled"
              style={{
                minHeight: '46px',
                paddingLeft: '2.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                width: '100%',
              }}
              placeholder="e.g. SAM-2026-1042"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--civic-text-muted)' }} />
          </div>

          <Button type="submit" variant="filled" style={{ minHeight: '46px', padding: '0.5rem 1.25rem', flex: '0 0 auto' }}>
            <span>{language === 'hi' ? 'डेमो रिकॉर्ड खोजें' : 'Find Demo Record'}</span>
          </Button>
        </form>

        {/* Quick Sample Reference Chips */}
        {sampleList.length > 0 && (
          <div style={{ width: '100%', marginTop: '0.25rem' }}>
            <div
              className="mobile-scroll-strip"
              style={{
                justifyContent: 'center',
                gap: '0.45rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600, alignSelf: 'center' }}>
                {language === 'hi' ? 'पुराने डेमो संदर्भ:' : 'Legacy demo references:'}
              </span>
              {sampleList.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className="chip chip-secondary"
                  style={{ cursor: 'pointer', border: '1px solid var(--civic-border-light)', fontSize: '0.75rem', minHeight: '32px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setQuery(s.id);
                    handleSearch(s.id);
                  }}
                >
                  {s.id} ({s.category.split(' ')[0]})
                </button>
              ))}
            </div>
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
                <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                  {language === 'hi' ? 'पुराना डेमो रिकॉर्ड' : 'Legacy demo record'}
                </span>
              </div>
              <h2 className="title-large" style={{ fontSize: '1.15rem', color: 'var(--civic-text-primary)' }}>
                {record.title}
              </h2>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                <Calendar size={13} style={{ color: 'var(--civic-text-muted)' }} />
                <span>{language === 'hi' ? 'पुराने रिकॉर्ड की तिथि:' : 'Legacy record date:'} <strong>{record.submittedAt}</strong></span>
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
                  {language === 'hi' ? 'पुराना अनुशंसित प्राधिकरण' : 'Historical recommended authority'}
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
              <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                {language === 'hi' ? `पुरानी डेमो स्थिति: ${record.status}` : `Legacy demo status: ${record.status}`}
              </span>
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
              {language === 'hi' ? 'पुरानी सिमुलेटेड डेमो टाइमलाइन' : 'Archived simulated demo timeline'}
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
              <span>{language === 'hi' ? 'यह टाइमलाइन केवल पुराने समाधान डेमो का भाग है।' : 'This timeline belongs only to the legacy SAMADHAN demo.'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
              <Info size={13} />
              <span>Legacy SAMADHAN demo record — not submitted to CPGRAMS.</span>
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
