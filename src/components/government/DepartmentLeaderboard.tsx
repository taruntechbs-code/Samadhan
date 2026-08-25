import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PeriodDepartmentMetrics } from '../../data/types';
import { Search, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface DepartmentLeaderboardProps {
  metrics: PeriodDepartmentMetrics[];
  onSelectDepartment: (entity: string) => void;
}

export const DepartmentLeaderboard: React.FC<DepartmentLeaderboardProps> = ({
  metrics,
  onSelectDepartment,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'Department' | 'State/UT'>('ALL');
  const [sortField, setSortField] = useState<'received' | 'disposed' | 'effectiveDisposalRate' | 'totalPending'>('received');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredMetrics = useMemo(() => {
    return metrics
      .filter(m => {
        const matchesScope = scopeFilter === 'ALL' || m.scope === scopeFilter;
        const matchesSearch = m.entity.toLowerCase().includes(searchTerm.toLowerCase().trim());
        return matchesScope && matchesSearch;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'desc' ? valB - valA : valA - valB;
        }
        return 0;
      });
  }, [metrics, searchTerm, scopeFilter, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
            {t('leaderboard.title')}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t('leaderboard.subtitle')} ({filteredMetrics.length} authorities)
          </p>
        </div>

        {/* Scope Pill Selector */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{
              minHeight: '34px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              backgroundColor: scopeFilter === 'ALL' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: scopeFilter === 'ALL' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
            }}
            onClick={() => setScopeFilter('ALL')}
          >
            {t('leaderboard.allAuth')}
          </button>
          <button
            type="button"
            className="btn"
            style={{
              minHeight: '34px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              backgroundColor: scopeFilter === 'Department' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: scopeFilter === 'Department' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
            }}
            onClick={() => setScopeFilter('Department')}
          >
            {t('leaderboard.centralMin')}
          </button>
          <button
            type="button"
            className="btn"
            style={{
              minHeight: '34px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              backgroundColor: scopeFilter === 'State/UT' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: scopeFilter === 'State/UT' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
            }}
            onClick={() => setScopeFilter('State/UT')}
          >
            {t('leaderboard.statesUts')}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        <input
          type="text"
          className="input-filled"
          style={{ minHeight: '44px', paddingLeft: '2.5rem', fontSize: '0.875rem', borderRadius: 'var(--radius-pill)' }}
          placeholder={t('leaderboard.searchPlaceholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--md-sys-color-on-surface-variant)' }} />
      </div>

      {/* Responsive Horizontal Scroll Table Container */}
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '16px', border: '1px solid var(--md-sys-color-border-subtle)' }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderBottom: '1px solid var(--md-sys-color-border-subtle)' }}>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                {t('leaderboard.colAuthority')}
              </th>
              <th
                style={{ padding: '0.875rem 1rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('received')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{t('leaderboard.colReceived')}</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                style={{ padding: '0.875rem 1rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('disposed')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{t('leaderboard.colDisposed')}</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                style={{ padding: '0.875rem 1rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('effectiveDisposalRate')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{t('leaderboard.colVelocity')}</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                style={{ padding: '0.875rem 1rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('totalPending')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{t('leaderboard.colPending')}</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{t('leaderboard.colRisk')}</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, textAlign: 'right' }}>{t('leaderboard.colAction')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredMetrics.slice(0, 30).map((m, idx) => {
              const disp = m.effectiveDisposalRate;
              const riskLevel =
                disp < 70 || m.pending_more_than_1_year > 0
                  ? 'CRITICAL'
                  : disp < 80
                  ? 'HIGH'
                  : disp < 90
                  ? 'MEDIUM'
                  : 'LOW';

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--md-sys-color-surface-container-low)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--md-sys-color-surface-container-low)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>{m.entity}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{m.scope}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>{m.received.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--md-sys-color-risk-low)', fontWeight: 600 }}>
                    {m.disposed.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{m.effectiveDisposalRate}%</td>
                  <td style={{ padding: '0.875rem 1rem' }}>{m.totalPending.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Badge riskLevel={riskLevel} />
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <Button
                      variant="tonal"
                      style={{ minHeight: '32px', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectDepartment(m.entity)}
                    >
                      <span>{t('leaderboard.inspectBtn')}</span>
                      <ChevronRight size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
