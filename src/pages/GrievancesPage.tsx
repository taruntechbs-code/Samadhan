import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { getStoredCitizenGrievances } from '../../src/services/apiClient';
import { FileText, Plus, Building2, ArrowRight } from 'lucide-react';

export const GrievancesPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const grievances = getStoredCitizenGrievances();

  const filtered = grievances.filter(g => {
    if (statusFilter === 'ALL') return true;
    return g.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge type="primary" style={{ marginBottom: '0.35rem' }}>
            <span>Citizen Dashboard</span>
          </Badge>
          <h1 className="headline-medium">My Lodged Grievances</h1>
          <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Track and manage all public grievances submitted under your account
          </p>
        </div>

        <Button variant="filled" onClick={() => navigate('/')}>
          <Plus size={18} />
          <span>Lodge New Grievance</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '0.35rem', borderRadius: 'var(--radius-pill)', width: 'fit-content' }}>
        {(['ALL', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'] as const).map(st => (
          <button
            key={st}
            type="button"
            className="btn"
            style={{
              minHeight: '36px',
              padding: '0.35rem 1rem',
              fontSize: '0.8125rem',
              backgroundColor: statusFilter === st ? 'var(--md-sys-color-primary)' : 'transparent',
              color: statusFilter === st ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
            }}
            onClick={() => setStatusFilter(st)}
          >
            {st === 'ALL' ? `All (${grievances.length})` : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grievance Cards List */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(g => (
            <Card
              key={g.id}
              variant="standard"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onClick={() => navigate(`/track?ref=${g.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--md-sys-color-primary)' }}>
                      {g.id}
                    </span>
                    <Badge status={g.status} />
                    <span className="chip chip-secondary" style={{ fontSize: '0.6875rem' }}>
                      {g.category}
                    </span>
                  </div>
                  <h3 className="title-medium" style={{ fontSize: '1.125rem', color: 'var(--md-sys-color-on-surface)' }}>
                    {g.title}
                  </h3>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Submitted: <strong>{g.submittedAt}</strong>
                </div>
              </div>

              {/* Routed Entity & Action */}
              <div
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Building2 size={16} style={{ color: 'var(--md-sys-color-primary)' }} />
                  <span>Authority: <strong>{g.routedEntity}</strong></span>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', fontWeight: 600, fontSize: '0.8125rem' }}>
                  <span>View Timeline &amp; Progress</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="standard" style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FileText size={40} style={{ color: 'var(--md-sys-color-outline)' }} />
          <div>
            <h3 className="title-large">No Grievances Found</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
              No grievances matched the selected filter.
            </p>
          </div>
          <Button variant="tonal" onClick={() => setStatusFilter('ALL')}>
            <span>Clear Filter</span>
          </Button>
        </Card>
      )}
    </div>
  );
};
