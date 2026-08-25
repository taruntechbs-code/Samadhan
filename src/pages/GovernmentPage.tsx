import React, { useState, useEffect } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingState';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { ExecutiveKpis } from '../components/government/ExecutiveKpis';
import { AgingDistributionCard } from '../components/government/AgingDistributionCard';
import { AttentionActionCockpit, AttentionActionItem } from '../components/government/AttentionActionCockpit';
import { DepartmentLeaderboard } from '../components/government/DepartmentLeaderboard';
import { DepartmentDetailModal } from '../components/government/DepartmentDetailModal';
import { AppealsIntelligenceCard } from '../components/government/AppealsIntelligenceCard';
import { SystemInsightsCard } from '../components/government/SystemInsightsCard';
import {
  fetchSystemOverview,
  fetchDepartmentRanking,
  fetchEnrichedAttention,
  fetchSystemInsights,
  fetchAppealsOverview,
} from '../../src/services/apiClient';
import { SystemOverview, AppealsOverview } from '../../src/services/types';
import { PeriodDepartmentMetrics } from '../../src/data/types';
import { SystemInsight } from '../../src/intelligence/types';
import { useTranslation } from '../i18n';
import {
  LayoutDashboard,
  ShieldAlert,
  ListOrdered,
  FileQuestion,
  RefreshCw,
  Activity,
  Globe2,
} from 'lucide-react';

export const GovernmentPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'attention' | 'leaderboard' | 'appeals'>('overview');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'Department' | 'State/UT'>('ALL');
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [leaderboardMetrics, setLeaderboardMetrics] = useState<PeriodDepartmentMetrics[]>([]);
  const [attentionItems, setAttentionItems] = useState<AttentionActionItem[]>([]);
  const [systemInsight, setSystemInsight] = useState<SystemInsight | null>(null);
  const [appeals, setAppeals] = useState<AppealsOverview | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (scope?: string) => {
    setLoading(true);
    try {
      const scopeParam = scope && scope !== 'ALL' ? scope : undefined;
      const [ov, rank, att, ins, app] = await Promise.all([
        fetchSystemOverview('live_dashboard_2026', scopeParam),
        fetchDepartmentRanking('received', 'desc', { scope: scopeParam }),
        fetchEnrichedAttention('live_dashboard_2026', scopeParam),
        fetchSystemInsights(),
        fetchAppealsOverview(),
      ]);

      setOverview(ov);
      setLeaderboardMetrics(rank);
      setAttentionItems(att as AttentionActionItem[]);
      setSystemInsight(ins);
      setAppeals(app);
    } catch (err) {
      console.error('Failed to load government dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(scopeFilter);
  }, [scopeFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2.5rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <Badge type="primary">
              <Activity size={12} />
              <span>{t('gov.badge')}</span>
            </Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('gov.liveTelemetry')}
            </span>
          </div>
          <h1 className="headline-medium">{t('gov.title')}</h1>
          <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t('gov.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {overview && (
            <EvidenceBadge
              evidence={{
                dataset: overview.dataset,
                entity: 'All Reporting Entities',
                metric: 'received / disposed',
                value: `${overview.disposed.toLocaleString('en-IN')} / ${overview.received.toLocaleString('en-IN')}`,
                period: `${overview.periodStart} to ${overview.periodEnd}`,
                sourceUrl: overview.source.sourceUrl,
                sourceNote: overview.source.sourceNote,
              }}
              label={t('gov.auditLineage')}
            />
          )}

          <Button variant="tonal" onClick={() => loadData(scopeFilter)} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>{t('gov.refreshTelemetry')}</span>
          </Button>
        </div>
      </div>

      {/* National Pulse Scope Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          padding: '0.75rem 1.25rem',
          borderRadius: '20px',
          border: '1px solid var(--md-sys-color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
          <Globe2 size={18} />
          <span>{t('gov.pulseScope')}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', flexWrap: 'wrap' }}>
          {(['ALL', 'Department', 'State/UT'] as const).map(sc => (
            <button
              key={sc}
              type="button"
              className="btn"
              style={{
                minHeight: '34px',
                padding: '0.35rem 1rem',
                fontSize: '0.8125rem',
                backgroundColor: scopeFilter === sc ? 'var(--md-sys-color-primary)' : 'transparent',
                color: scopeFilter === sc ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
              }}
              onClick={() => setScopeFilter(sc)}
            >
              {sc === 'ALL' ? t('gov.allIndia') : sc === 'Department' ? t('gov.centralMinistries') : t('gov.statesUts')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cockpit Navigation Tabs */}
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
          border: '1px solid var(--md-sys-color-border-subtle)',
        }}
      >
        <button
          type="button"
          className="btn"
          style={{
            minHeight: '40px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'overview' ? 'var(--md-sys-color-primary)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
          }}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} />
          <span>{t('gov.tabOverview')}</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '40px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'attention' ? 'var(--md-sys-color-primary)' : 'transparent',
            color: activeTab === 'attention' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
          }}
          onClick={() => setActiveTab('attention')}
        >
          <ShieldAlert size={16} />
          <span>{t('gov.tabAttention')} ({attentionItems.length})</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '40px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'leaderboard' ? 'var(--md-sys-color-primary)' : 'transparent',
            color: activeTab === 'leaderboard' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
          }}
          onClick={() => setActiveTab('leaderboard')}
        >
          <ListOrdered size={16} />
          <span>{t('gov.tabLeaderboard')}</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '40px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            backgroundColor: activeTab === 'appeals' ? 'var(--md-sys-color-primary)' : 'transparent',
            color: activeTab === 'appeals' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
          }}
          onClick={() => setActiveTab('appeals')}
        >
          <FileQuestion size={16} />
          <span>{t('gov.tabAppeals')}</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading || !overview ? (
        <LoadingSpinner label={t('gov.compilingTelemetry')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeTab === 'overview' && (
            <>
              {/* Executive KPIs */}
              <ExecutiveKpis overview={overview} />

              {/* Grid: Aging Distribution & System Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                <AgingDistributionCard aging={overview.agingBuckets} />
                {systemInsight && (
                  <SystemInsightsCard insight={systemInsight} onSelectDepartment={setSelectedDepartment} />
                )}
              </div>

              {/* Top Attention Items Preview */}
              {attentionItems.length > 0 && (
                <AttentionActionCockpit
                  items={attentionItems.slice(0, 4)}
                  onSelectDepartment={setSelectedDepartment}
                />
              )}

              {/* Appeals Summary Card */}
              {appeals && (
                <AppealsIntelligenceCard appeals={appeals} onSelectDepartment={setSelectedDepartment} />
              )}
            </>
          )}

          {activeTab === 'attention' && (
            <AttentionActionCockpit
              items={attentionItems}
              onSelectDepartment={setSelectedDepartment}
            />
          )}

          {activeTab === 'leaderboard' && (
            <DepartmentLeaderboard
              metrics={leaderboardMetrics}
              onSelectDepartment={setSelectedDepartment}
            />
          )}

          {activeTab === 'appeals' && appeals && (
            <AppealsIntelligenceCard
              appeals={appeals}
              onSelectDepartment={setSelectedDepartment}
            />
          )}
        </div>
      )}

      {/* Department Detail Drilldown Modal */}
      <DepartmentDetailModal
        entityName={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
    </div>
  );
};
