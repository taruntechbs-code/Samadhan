import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { getStoredCitizenGrievances, CitizenGrievanceRecord } from '../../src/services/apiClient';
import { useTranslation } from '../i18n';
import { FileText, PlusCircle, Search, Clock, Building2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GrievancesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [grievances] = useState<CitizenGrievanceRecord[]>(() => getStoredCitizenGrievances());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = grievances.filter(g => {
    if (statusFilter === 'ALL') return true;
    return g.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Badge type="primary">
              <FileText size={12} />
              <span>{t('myGrievances.badge')}</span>
            </Badge>
          </div>
          <h1 className="headline-large" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
            {t('myGrievances.title')}
          </h1>
          <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t('myGrievances.subtitle')}
          </p>
        </div>

        <Button variant="filled" onClick={() => navigate('/')}>
          <PlusCircle size={16} />
          <span>{t('myGrievances.lodgeNewBtn')}</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          padding: '0.4rem',
          borderRadius: 'var(--radius-pill)',
          width: 'fit-content',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-level-1)',
        }}
      >
        {[
          { key: 'ALL', label: `${t('myGrievances.all')} (${grievances.length})` },
          { key: 'UNDER_REVIEW', label: t('myGrievances.underReview') },
          { key: 'IN_PROGRESS', label: t('myGrievances.inProgress') },
          { key: 'RESOLVED', label: t('myGrievances.resolved') },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className="btn"
            style={{
              minHeight: '36px',
              padding: '0.4rem 1rem',
              fontSize: '0.8125rem',
              backgroundColor: statusFilter === tab.key ? 'var(--md-sys-color-primary)' : 'transparent',
              color: statusFilter === tab.key ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
            }}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grievance Records List */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(item => (
            <Card
              key={item.id}
              variant="standard"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onClick={() => navigate(`/track?ref=${item.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--md-sys-color-primary)', letterSpacing: '0.04em' }}>
                      {item.id}
                    </span>
                    <Badge status={item.status} />
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="title-medium" style={{ fontSize: '1.1rem', color: 'var(--md-sys-color-on-surface)' }}>
                    {item.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.8125rem' }}>
                  <Clock size={14} />
                  <span>{t('myGrievances.submitted')} {item.submittedAt}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--md-sys-color-surface-container-low)',
                  paddingTop: '0.75rem',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface)' }}>
                  <Building2 size={16} style={{ color: 'var(--md-sys-color-primary)' }} />
                  <span>{t('myGrievances.authority')} <strong>{item.routedEntity}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
                  <span>{t('myGrievances.viewTimeline')}</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="standard" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Search size={40} style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.5 }} />
          <div>
            <h3 className="title-large">{t('myGrievances.emptyTitle')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
              {t('myGrievances.emptyDesc')}
            </p>
          </div>
          <Button variant="tonal" onClick={() => setStatusFilter('ALL')}>
            <span>{t('myGrievances.clearFilter')}</span>
          </Button>
        </Card>
      )}
    </div>
  );
};
