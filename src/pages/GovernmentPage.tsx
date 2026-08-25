import React, { useState, useEffect } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingState';
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
import {
  LayoutDashboard,
  ShieldAlert,
  ListOrdered,
  FileQuestion,
  RefreshCw,
  Activity,
} from 'lucide-react';

export const GovernmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attention' | 'leaderboard' | 'appeals'>('overview');
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [leaderboardMetrics, setLeaderboardMetrics] = useState<PeriodDepartmentMetrics[]>([]);
  const [attentionItems, setAttentionItems] = useState<AttentionActionItem[]>([]);
  const [systemInsight, setSystemInsight] = useState<SystemInsight | null>(null);
  const [appeals, setAppeals] = useState<AppealsOverview | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, rank, att, ins, app] = await Promise.all([
        fetchSystemOverview('live_dashboard_2026'),
        fetchDepartmentRanking('received', 'desc'),
        fetchEnrichedAttention('live_dashboard_2026'),
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
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <Badge type="primary">
              <Activity size={12} />
              <span>National Operations &amp; Intelligence Cockpit</span>
            </Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Official CPGRAMS Live Telemetry &bull; 2026
            </span>
          </div>
          <h1 className="headline-medium">Administrative Redressal Cockpit</h1>
          <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Real-time monitoring, AI risk triage, and actionable operational insights across 278 public entities
          </p>
        </div>

        <Button variant="tonal" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh Live Telemetry</span>
        </Button>
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
          <span>Executive Overview</span>
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
          <span>Action Required ({attentionItems.length})</span>
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
          <span>Authority Leaderboard</span>
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
          <span>Appellate Intelligence</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading || !overview ? (
        <LoadingSpinner label="Compiling CPGRAMS system intelligence..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeTab === 'overview' && (
            <>
              {/* Executive KPIs */}
              <ExecutiveKpis overview={overview} />

              {/* Grid: Aging Distribution & System Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
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
