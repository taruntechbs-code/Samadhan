import React, { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { getStoredCitizenGrievances, CitizenGrievanceRecord } from '../services/apiClient';
import { useTranslation } from '../i18n';
import {
  PlusCircle,
  Search,
  Building2,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GrievancesPage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [grievances] = useState<CitizenGrievanceRecord[]>(() => getStoredCitizenGrievances());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = grievances.filter(g => {
    if (statusFilter === 'ALL') return true;
    return g.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '960px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* Header Bar */}
      <div
        className="card-surface"
        style={{
          border: '1px solid var(--civic-border-medium)',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="chip chip-primary" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
              {language === 'hi' ? 'नागरिक डैशबोर्ड' : 'CITIZEN PORTFOLIO'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
              {grievances.length} {language === 'hi' ? 'दर्ज शिकायतें' : 'Registered Records'}
            </span>
          </div>

          <h1 className="headline-medium" style={{ fontSize: '1.4rem', color: 'var(--civic-text-primary)' }}>
            {language === 'hi' ? 'मेरी दर्ज शिकायतें' : 'My Grievances Portfolio'}
          </h1>
          <p className="body-medium" style={{ color: 'var(--civic-text-secondary)', marginTop: '0.15rem' }}>
            {language === 'hi'
              ? 'आपके खाते के अंतर्गत दर्ज सभी शिकायतों की स्थिति, समयसीमा एवं नोडल अधिकारी असाइनमेंट ट्रैक करें'
              : 'Inspect resolution milestones, aging timelines, and nodal officer assignments for your submitted grievances'}
          </p>
        </div>

        <Button variant="filled" onClick={() => navigate('/')} style={{ minHeight: '40px', fontSize: '0.8125rem' }}>
          <PlusCircle size={15} />
          <span>{language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Lodge New Grievance'}</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div
        className="mobile-scroll-strip"
        style={{
          gap: '0.35rem',
          backgroundColor: '#FFFFFF',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          width: '100%',
          border: '1px solid var(--civic-border-light)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {[
          { key: 'ALL', label: `${language === 'hi' ? 'सभी' : 'All'} (${grievances.length})` },
          { key: 'UNDER_REVIEW', label: language === 'hi' ? 'समीक्षाधीन' : 'Under Review' },
          { key: 'IN_PROGRESS', label: language === 'hi' ? 'प्रगति पर' : 'In Progress' },
          { key: 'RESOLVED', label: language === 'hi' ? 'निपटाया गया' : 'Resolved' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className="btn"
            style={{
              minHeight: '38px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: statusFilter === tab.key ? 'var(--civic-brand-light)' : 'transparent',
              color: statusFilter === tab.key ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
              fontWeight: statusFilter === tab.key ? 700 : 500,
              border: statusFilter === tab.key ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grievance Records List */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map(item => (
            <div
              key={item.id}
              className="card-surface"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                padding: '1.25rem',
              }}
              onClick={() => navigate(`/track?ref=${item.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--civic-brand)', letterSpacing: '0.04em', fontSize: '0.9375rem' }}>
                      {item.id}
                    </span>
                    <Badge status={item.status} />
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="title-medium" style={{ fontSize: '1.05rem', color: 'var(--civic-text-primary)' }}>
                    {item.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--civic-text-muted)', fontSize: '0.75rem' }}>
                  <Calendar size={13} />
                  <span>{language === 'hi' ? 'दर्ज:' : 'Submitted:'} {item.submittedAt}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--civic-border-light)',
                  paddingTop: '0.75rem',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--civic-text-secondary)' }}>
                  <Building2 size={15} style={{ color: 'var(--civic-brand)' }} />
                  <span>{language === 'hi' ? 'प्राधिकरण:' : 'Authority:'} <strong style={{ color: 'var(--civic-text-primary)' }}>{item.routedEntity}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--civic-brand)', fontWeight: 600, fontSize: '0.8125rem' }}>
                  <span>{language === 'hi' ? 'प्रगति टाइमलाइन देखें' : 'View Timeline & Progress'}</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Search size={36} style={{ color: 'var(--civic-text-muted)', opacity: 0.5 }} />
          <div>
            <h3 className="title-large">{t('myGrievances.emptyTitle')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-muted)', marginTop: '0.25rem' }}>
              {t('myGrievances.emptyDesc')}
            </p>
          </div>
          <Button variant="tonal" onClick={() => setStatusFilter('ALL')}>
            <span>{t('myGrievances.clearFilter')}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
