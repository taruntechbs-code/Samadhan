import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { clearLegacyCitizenGrievances, getStoredCitizenGrievances, CitizenGrievanceRecord, LEGACY_DEMO_LABEL } from '../services/apiClient';
import { useTranslation } from '../i18n';
import {
  PlusCircle,
  Search,
  Building2,
  ChevronRight,
  Calendar,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GrievancesPage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<CitizenGrievanceRecord[]>(() => getStoredCitizenGrievances());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = grievances.filter(g => {
    if (statusFilter === 'ALL') return true;
    return g.status === statusFilter;
  });

  const handleClearLegacyData = () => {
    const confirmed = window.confirm(language === 'hi'
      ? 'क्या आप इस ब्राउज़र से सभी पुराने समाधान डेमो रिकॉर्ड हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।'
      : 'Clear all legacy SAMADHAN demo records from this browser? This cannot be undone.');
    if (!confirmed) return;
    clearLegacyCitizenGrievances();
    setGrievances([]);
  };

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
              {language === 'hi' ? 'पुराना ब्राउज़र डेटा' : 'LEGACY BROWSER DATA'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
              {grievances.length} {language === 'hi' ? 'डेमो रिकॉर्ड' : 'demo records'}
            </span>
          </div>

          <h1 className="headline-medium" style={{ fontSize: '1.4rem', color: 'var(--civic-text-primary)' }}>
            {language === 'hi' ? 'पुराने समाधान डेमो रिकॉर्ड' : 'Legacy SAMADHAN Demo Records'}
          </h1>
          <p className="body-medium" style={{ color: 'var(--civic-text-secondary)', marginTop: '0.15rem' }}>
            {language === 'hi'
              ? 'ये केवल इस ब्राउज़र में रखे पुराने डेमो रिकॉर्ड हैं; ये आधिकारिक प्रस्तुति, खाते या सरकारी रिकॉर्ड नहीं हैं।'
              : 'These browser-only records are not official submissions, accounts, or government records.'}
          </p>
        </div>

        <Button variant="filled" onClick={() => navigate('/')} style={{ minHeight: '40px', fontSize: '0.8125rem' }}>
          <PlusCircle size={15} />
          <span>{language === 'hi' ? 'नई शिकायत तैयार करें' : 'Prepare a New Grievance'}</span>
        </Button>
      </div>

      <div style={{ padding: '0.875rem 1rem', border: '1px solid var(--civic-warning-border)', backgroundColor: 'var(--civic-warning-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <strong style={{ color: 'var(--civic-warning-text)', fontSize: '0.8125rem' }}>{LEGACY_DEMO_LABEL}</strong>
        <Button type="button" variant="text" onClick={handleClearLegacyData} disabled={grievances.length === 0}>
          <Trash2 size={15} />
          <span>{language === 'hi' ? 'पुराना डेमो डेटा साफ़ करें' : 'Clear legacy demo data'}</span>
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
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {language === 'hi' ? 'पुराना डेमो रिकॉर्ड' : 'Legacy demo record'}
                    </span>
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
                  <span>{language === 'hi' ? 'पुराने रिकॉर्ड की तिथि:' : 'Legacy record date:'} {item.submittedAt}</span>
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
                  <span>{language === 'hi' ? 'पुराना डेमो विवरण देखें' : 'View legacy demo details'}</span>
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
