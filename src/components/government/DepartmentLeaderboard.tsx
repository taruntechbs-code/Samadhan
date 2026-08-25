import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DisposalRateBar } from '../common/Charts';
import { formatIndianNumber } from '../common/MetricCard';
import { PeriodDepartmentMetrics } from '../../data/types';
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { RiskLevel } from '../../intelligence/types';

export interface DepartmentLeaderboardProps {
  metrics: PeriodDepartmentMetrics[];
  onSelectDepartment: (entity: string) => void;
}

export const DepartmentLeaderboard: React.FC<DepartmentLeaderboardProps> = ({
  metrics,
  onSelectDepartment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'Department' | 'State/UT'>('ALL');
  const [sortKey, setSortKey] = useState<'received' | 'disposed' | 'effectiveDisposalRate' | 'totalPending'>('received');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort
  const filtered = metrics
    .filter(m => {
      if (scopeFilter !== 'ALL' && m.scope !== scopeFilter) return false;
      if (searchTerm && !m.entity.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortKey] as number;
      const valB = b[sortKey] as number;
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <Card variant="standard" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Search and Scope Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="title-large" style={{ fontSize: '1.25rem' }}>
            Authority Performance Leaderboard
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Showing {filtered.length} public authorities ranked by grievance throughput
          </p>
        </div>

        {/* Scope Pill Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          {(['ALL', 'Department', 'State/UT'] as const).map(scope => (
            <button
              key={scope}
              type="button"
              className="btn"
              style={{
                minHeight: '34px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                backgroundColor: scopeFilter === scope ? 'var(--md-sys-color-primary)' : 'transparent',
                color: scopeFilter === scope ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
              }}
              onClick={() => setScopeFilter(scope)}
            >
              {scope === 'ALL' ? 'All Authorities' : scope === 'Department' ? 'Central Ministries' : 'States / UTs'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
        <input
          type="text"
          className="input-filled"
          style={{ minHeight: '44px', paddingLeft: '2.5rem', fontSize: '0.875rem', borderRadius: 'var(--radius-pill)' }}
          placeholder="Search by ministry or state name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--md-sys-color-on-surface-variant)' }} />
      </div>

      {/* Leaderboard Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Authority Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => toggleSort('received')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Received</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => toggleSort('disposed')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Disposed</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, cursor: 'pointer', minWidth: '160px' }} onClick={() => toggleSort('effectiveDisposalRate')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Disposal Velocity</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => toggleSort('totalPending')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Pending</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Operational Risk</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((row, idx) => {
              let riskLevel: RiskLevel = 'LOW';
              if (row.effectiveDisposalRate < 70 || row.pending_more_than_1_year > 0) riskLevel = 'CRITICAL';
              else if (row.effectiveDisposalRate < 80 || row.pending_180_365_days > 50) riskLevel = 'HIGH';
              else if (row.effectiveDisposalRate < 90) riskLevel = 'MEDIUM';

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
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>
                    <div>{row.entity}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {row.scope}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{formatIndianNumber(row.received)}</td>
                  <td style={{ padding: '1rem', color: 'var(--md-sys-color-risk-low)', fontWeight: 600 }}>
                    {formatIndianNumber(row.disposed)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <DisposalRateBar rate={row.effectiveDisposalRate} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{formatIndianNumber(row.totalPending)}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge riskLevel={riskLevel} />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-tonal"
                      style={{ minHeight: '32px', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectDepartment(row.entity)}
                    >
                      <span>Inspect</span>
                      <ChevronRight size={14} />
                    </button>
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
