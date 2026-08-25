import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { GrievanceTimeline } from '../components/citizen/GrievanceTimeline';
import { getGrievanceByRef, getStoredCitizenGrievances, CitizenGrievanceRecord } from '../../src/services/apiClient';
import { Search, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

export const TrackPage: React.FC = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header & Search Input */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <Badge type="primary">
          <span>Real-Time Citizen Tracking</span>
        </Badge>
        <h1 className="headline-large" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          Track Your Grievance Status
        </h1>
        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '520px' }}>
          Enter your official SAMADHAN reference number to view real-time nodal officer assignment and resolution milestones.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '540px', marginTop: '0.75rem' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              required
              className="input-filled"
              style={{
                minHeight: '48px',
                borderRadius: 'var(--radius-pill)',
                paddingLeft: '2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
              placeholder="e.g. SAM-2026-1042"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--md-sys-color-on-surface-variant)' }} />
          </div>

          <Button type="submit" variant="filled" style={{ minHeight: '48px' }}>
            <span>Lookup</span>
          </Button>
        </form>

        {/* Quick Sample Ref Chips */}
        {sampleList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Recent grievances:
            </span>
            {sampleList.map(s => (
              <button
                key={s.id}
                type="button"
                className="chip chip-secondary"
                style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem' }}
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
        <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
          {/* Top Status Banner */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-primary)', letterSpacing: '0.03em' }}>
                  {record.id}
                </span>
                <Badge status={record.status} />
              </div>
              <h2 className="title-large" style={{ fontSize: '1.25rem', color: 'var(--md-sys-color-on-surface)' }}>
                {record.title}
              </h2>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <div>Submitted On: <strong>{record.submittedAt}</strong></div>
              <div>Applicant: <strong>{record.applicantName}</strong></div>
            </div>
          </div>

          {/* Assigned Authority Box */}
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-secondary-container)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={24} style={{ color: 'var(--md-sys-color-on-secondary-container)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-secondary-container)', opacity: 0.8 }}>
                  Assigned Authority / Redressal Cell
                </div>
                <div style={{ fontWeight: 700, color: 'var(--md-sys-color-on-secondary-container)' }}>
                  {record.routedEntity}
                </div>
              </div>
            </div>

            <span className="chip chip-primary" style={{ fontSize: '0.75rem' }}>
              {record.category}
            </span>
          </div>

          {/* Grievance Statement */}
          <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1rem 1.25rem', borderRadius: '14px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Grievance Description:
            </span>
            <p style={{ fontSize: '0.9375rem', color: 'var(--md-sys-color-on-surface)', marginTop: '0.25rem' }}>
              {record.description}
            </p>
          </div>

          {/* Visual Redressal Timeline */}
          <div>
            <h3 className="title-medium" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
              Redressal Lifecycle &amp; Progress
            </h3>
            <GrievanceTimeline items={record.timeline} />
          </div>

          {/* SLA Standard Notice */}
          <div
            style={{
              borderTop: '1px solid var(--md-sys-color-surface-container-low)',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--md-sys-color-risk-low)' }} />
            <span>
              Standard DARPG Citizen Charter SLA: Grievances are targeted for resolution within 30 operational days.
            </span>
          </div>
        </Card>
      ) : hasSearched ? (
        /* Not Found State */
        <Card variant="standard" style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={40} style={{ color: 'var(--md-sys-color-risk-high)' }} />
          <div>
            <h3 className="title-large">Reference Not Found</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
              No grievance found for reference &quot;{query}&quot;. Please double check the ID or try one of the sample references above.
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
