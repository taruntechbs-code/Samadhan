import React, { useState, useEffect } from 'react';
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
import { HistoricalIntelligenceCard } from '../components/government/HistoricalIntelligenceCard';
import {
  fetchSystemOverview,
  fetchDepartmentRanking,
  fetchEnrichedAttention,
  fetchSystemInsights,
  fetchAppealsOverview,
} from '../services/apiClient';
import { SystemOverview, AppealsOverview } from '../services/types';
import { PeriodDepartmentMetrics } from '../data/types';
import { SystemInsight } from '../intelligence/types';
import { useTranslation } from '../i18n';
import {
  LayoutDashboard,
  ShieldAlert,
  ListOrdered,
  FileQuestion,
  RefreshCw,
  Globe2,
  History
} from 'lucide-react';

export const GovernmentPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'attention' | 'leaderboard' | 'appeals' | 'historical'>('overview');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2.5rem' }}>
      {/* Executive Header Banner */}
      <div
        className="card-surface"
        style={{
          border: '1px solid var(--civic-border-medium)',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {language === 'hi' ? 'राष्ट्रीय लोक शिकायत प्रज्ञान' : 'NATIONAL PUBLIC GRIEVANCE INTELLIGENCE'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                {language === 'hi' ? 'सत्यापित अवधि: 01 जन 2026 – 24 अगस्त 2026' : 'Reporting Period: 01 Jan 2026 – 24 Aug 2026 (Live Verified Telemetry)'}
              </span>
            </div>

            <h1 className="headline-large" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'प्रशासनिक संचालन एवं निवारण कॉकपिट' : 'Executive Operations & Redressal Intelligence'}
            </h1>
            <p className="body-medium" style={{ color: 'var(--civic-text-secondary)', marginTop: '0.2rem' }}>
              {language === 'hi'
                ? '278 लोक प्राधिकरणों में वास्तविक समय की निगरानी, व्याख्यात्मक जोखिम मूल्यांकन और निर्णायक प्रशासनिक दिशा-निर्देश'
                : 'Real-time telemetry monitoring, explainable risk causation, and targeted operational intervention across 278 public authorities'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
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
                label={language === 'hi' ? 'सीपीग्राम्स ऑडिट' : 'CPGRAMS Audit Lineage'}
              />
            )}

            <Button variant="tonal" onClick={() => loadData(scopeFilter)} disabled={loading} style={{ minHeight: '38px', fontSize: '0.8125rem' }}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>{language === 'hi' ? 'रीफ्रेश' : 'Refresh Telemetry'}</span>
            </Button>
          </div>
        </div>

        {/* National Pulse Scope Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--civic-border-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-text-secondary)' }}>
            <Globe2 size={16} style={{ color: 'var(--civic-brand)' }} />
            <span>{language === 'hi' ? 'भौगोलिक एवं प्रशासनिक दायरा:' : 'National Intelligence Scope:'}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--civic-canvas-subtle)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--civic-border-light)' }}>
            {(['ALL', 'Department', 'State/UT'] as const).map(sc => (
              <button
                key={sc}
                type="button"
                className="btn"
                style={{
                  minHeight: '32px',
                  padding: '0.25rem 0.85rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: scopeFilter === sc ? 'var(--civic-brand)' : 'transparent',
                  color: scopeFilter === sc ? '#FFFFFF' : 'var(--civic-text-secondary)',
                  border: 'none',
                }}
                onClick={() => setScopeFilter(sc)}
              >
                {sc === 'ALL'
                  ? (language === 'hi' ? 'अखिल भारतीय (127 निकाय)' : 'All-India (127 Entities)')
                  : sc === 'Department'
                  ? (language === 'hi' ? 'केंद्रीय मंत्रालय (88 विभाग)' : 'Central Ministries (88)')
                  : (language === 'hi' ? 'राज्य एवं केंद्र शासित प्रदेश (39)' : 'States & UTs (39)')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Cockpit Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          backgroundColor: '#FFFFFF',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          width: 'fit-content',
          flexWrap: 'wrap',
          border: '1px solid var(--civic-border-light)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <button
          type="button"
          className="btn"
          style={{
            minHeight: '36px',
            padding: '0.4rem 1rem',
            fontSize: '0.8125rem',
            backgroundColor: activeTab === 'overview' ? 'var(--civic-brand-light)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            border: activeTab === 'overview' ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={15} />
          <span>{language === 'hi' ? 'कार्यकारी सारांश' : 'Executive Overview'}</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '36px',
            padding: '0.4rem 1rem',
            fontSize: '0.8125rem',
            backgroundColor: activeTab === 'attention' ? 'var(--civic-brand-light)' : 'transparent',
            color: activeTab === 'attention' ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
            fontWeight: activeTab === 'attention' ? 700 : 500,
            border: activeTab === 'attention' ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('attention')}
        >
          <ShieldAlert size={15} />
          <span>{language === 'hi' ? 'कार्रवाई आवश्यक (एक्शन कॉकपिट)' : 'Attention Action Cockpit'} ({attentionItems.length})</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '36px',
            padding: '0.4rem 1rem',
            fontSize: '0.8125rem',
            backgroundColor: activeTab === 'leaderboard' ? 'var(--civic-brand-light)' : 'transparent',
            color: activeTab === 'leaderboard' ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
            fontWeight: activeTab === 'leaderboard' ? 700 : 500,
            border: activeTab === 'leaderboard' ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('leaderboard')}
        >
          <ListOrdered size={15} />
          <span>{language === 'hi' ? 'प्राधिकरण लीडरबोर्ड' : 'Authority Leaderboard'}</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '36px',
            padding: '0.4rem 1rem',
            fontSize: '0.8125rem',
            backgroundColor: activeTab === 'appeals' ? 'var(--civic-brand-light)' : 'transparent',
            color: activeTab === 'appeals' ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
            fontWeight: activeTab === 'appeals' ? 700 : 500,
            border: activeTab === 'appeals' ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('appeals')}
        >
          <FileQuestion size={15} />
          <span>{language === 'hi' ? 'द्वितीयक अपील' : 'Appellate Intelligence'}</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            minHeight: '36px',
            padding: '0.4rem 1rem',
            fontSize: '0.8125rem',
            backgroundColor: activeTab === 'historical' ? 'var(--civic-brand-light)' : 'transparent',
            color: activeTab === 'historical' ? 'var(--civic-brand-dark)' : 'var(--civic-text-secondary)',
            fontWeight: activeTab === 'historical' ? 700 : 500,
            border: activeTab === 'historical' ? '1px solid var(--civic-brand-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('historical')}
        >
          <History size={15} />
          <span>{language === 'hi' ? '10-वर्षीय ऐतिहासिक रुझान' : 'Historical Trends (2016–2026)'}</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading || !overview ? (
        <LoadingSpinner label={t('gov.compilingTelemetry')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {activeTab === 'overview' && (
            <>
              {/* Executive Summary Metrics */}
              <ExecutiveKpis overview={overview} />

              {/* Attention Action Cockpit as Prominent Hero Section */}
              {attentionItems.length > 0 && (
                <AttentionActionCockpit
                  items={attentionItems.slice(0, 4)}
                  onSelectDepartment={setSelectedDepartment}
                />
              )}

              {/* Grid: Aging Distribution & System Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                <AgingDistributionCard aging={overview.agingBuckets} />
                {systemInsight && (
                  <SystemInsightsCard insight={systemInsight} onSelectDepartment={setSelectedDepartment} />
                )}
              </div>

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

          {activeTab === 'historical' && (
            <HistoricalIntelligenceCard
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
