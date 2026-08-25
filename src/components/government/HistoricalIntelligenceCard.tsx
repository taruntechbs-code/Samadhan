import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { useTranslation } from '../../i18n';
import {
  fetchHistoricalOverview,
  fetchHistoricalComparisons,
  fetchMunicipalCaseStudy,
} from '../../services/apiClient';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  Building2,
} from 'lucide-react';

interface HistoricalIntelligenceCardProps {
  onSelectDepartment?: (entity: string) => void;
}

export const HistoricalIntelligenceCard: React.FC<HistoricalIntelligenceCardProps> = ({
  onSelectDepartment,
}) => {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'IMPROVING' | 'STABLE' | 'DETERIORATING'>('ALL');
  const [showMunicipal, setShowMunicipal] = useState(false);
  const [municipalData, setMunicipalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchHistoricalOverview(),
      fetchHistoricalComparisons(),
      fetchMunicipalCaseStudy(),
    ])
      .then(([ov, tr, mun]) => {
        setOverview(ov);
        setTrends(tr || []);
        setMunicipalData(mun);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTrends = trends.filter(item => {
    if (filter === 'ALL') return true;
    return item.trend === filter;
  });

  const getTrendBadge = (trend: string, delta: number) => {
    if (trend === 'IMPROVING') {
      return (
        <span
          className="chip chip-low"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
        >
          <TrendingUp size={13} />
          <span>+{delta}% • {t('historical.improving')}</span>
        </span>
      );
    }
    if (trend === 'DETERIORATING') {
      return (
        <span
          className="chip chip-critical"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
        >
          <TrendingDown size={13} />
          <span>{delta}% • {t('historical.deteriorating')}</span>
        </span>
      );
    }
    if (trend === 'STABLE') {
      return (
        <span
          className="chip chip-medium"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
        >
          <Minus size={13} />
          <span>{delta >= 0 ? `+${delta}%` : `${delta}%`} • {t('historical.stable')}</span>
        </span>
      );
    }
    return (
      <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
        {t('historical.insufficientHistory')}
      </span>
    );
  };

  if (loading) {
    return (
      <Card variant="standard" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t('historical.loading')}
        </p>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Longitudinal Context */}
      <Card variant="standard" style={{ border: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
                {t('historical.title')}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', margin: '0.2rem 0 0 0' }}>
                {t('historical.subtitle')}
              </p>
            </div>
          </div>

          <EvidenceBadge
            evidence={{
              dataset: 'department_history_2016_2026-02-28',
              entity: 'CPGRAMS Central 10-Year Series',
              metric: 'longitudinal_baseline',
              value: '2016-01-01 to 2026-02-28',
              period: '10-Year Longitudinal Series',
              sourceUrl: 'https://www.data.gov.in/resource/department-wise-receipts-disposal-and-pendency-public-grievance-detailed-statistics',
              sourceNote: 'Official DARPG historical statistics series.',
            }}
            label={t('historical.evidenceBadge')}
          />
        </div>

        {/* System Longitudinal KPIs */}
        {overview && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--md-sys-color-outline-variant)',
            }}
          >
            <div style={{ padding: '0.75rem 1rem', background: '#FAF6FB', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>
                {t('historical.historicalBaselineRate')}
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-primary)', marginTop: '0.25rem' }}>
                {overview.overallHistoricalDisposalRate}%
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                10-Year Aggregate (2016–2026)
              </span>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: '#FAF6FB', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>
                {t('historical.currentVelocity')}
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--md-sys-color-secondary)', marginTop: '0.25rem' }}>
                {overview.overallCurrentDisposalRate}%
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Live 2026 Telemetry (Jan–Aug)
              </span>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: '#FAF6FB', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>
                {t('historical.authoritiesTracked')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--md-sys-color-on-surface)' }}>
                  {overview.totalEntitiesWithHistory}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  ({overview.improvingCount} {t('historical.improving')}, {overview.deterioratingCount} {t('historical.deteriorating')})
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Mapped Longitudinal Entities
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['ALL', 'IMPROVING', 'STABLE', 'DETERIORATING'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '20px',
                border: filter === tab ? '1.5px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
                backgroundColor: filter === tab ? 'var(--md-sys-color-primary)' : '#FFFFFF',
                color: filter === tab ? '#FFFFFF' : 'var(--md-sys-color-on-surface)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab === 'ALL' && `${t('historical.filterAll')} (${trends.length})`}
              {tab === 'IMPROVING' && `${t('historical.filterImproving')} (${trends.filter(t => t.trend === 'IMPROVING').length})`}
              {tab === 'STABLE' && `${t('historical.filterStable')} (${trends.filter(t => t.trend === 'STABLE').length})`}
              {tab === 'DETERIORATING' && `${t('historical.filterDeteriorating')} (${trends.filter(t => t.trend === 'DETERIORATING').length})`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowMunicipal(!showMunicipal)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.875rem',
            borderRadius: '20px',
            border: '1px solid var(--md-sys-color-secondary)',
            backgroundColor: showMunicipal ? 'var(--md-sys-color-secondary-container)' : '#FFFFFF',
            color: 'var(--md-sys-color-on-secondary-container)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Building2 size={14} />
          <span>{showMunicipal ? t('historical.hideMunicipalCase') : t('historical.showMunicipalCase')}</span>
        </button>
      </div>

      {/* Municipal Case Study Isolated Drawer */}
      {showMunicipal && municipalData && (
        <Card
          variant="standard"
          style={{
            border: '1.5px solid var(--md-sys-color-secondary)',
            backgroundColor: '#FAF5FF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} style={{ color: 'var(--md-sys-color-secondary)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
                  {municipalData.corporation} (2025 Case Study)
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {municipalData.disclaimer}
                </p>
              </div>
            </div>

            <Badge type="secondary">
              <span>{municipalData.disposalRate}% Municipal Redressal</span>
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {municipalData.categories.map((cat: any) => (
              <div
                key={cat.category}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {cat.totalResolved.toLocaleString('en-IN')}/{cat.totalReceived.toLocaleString('en-IN')} resolved
                  </span>
                  <strong style={{ color: 'var(--md-sys-color-primary)' }}>{cat.disposalRate}%</strong>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                  Avg Resolution: {cat.avgResolutionDays} days
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Authority Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredTrends.map(item => (
          <Card
            key={item.entity}
            variant="standard"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--md-sys-color-outline-variant)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.875rem',
              cursor: onSelectDepartment ? 'pointer' : 'default',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onClick={() => onSelectDepartment && onSelectDepartment(item.entity)}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>
                    {item.scope}
                  </span>
                  <h4 style={{ margin: '0.1rem 0 0 0', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
                    {item.entity}
                  </h4>
                </div>
                {getTrendBadge(item.trend, item.varianceDisposalRate)}
              </div>

              {/* Performance Comparison Numbers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  padding: '0.625rem',
                  borderRadius: '10px',
                  backgroundColor: '#FAF6FB',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>
                    {t('historical.currentDisposal')}
                  </span>
                  <strong style={{ fontSize: '1.125rem', color: 'var(--md-sys-color-on-surface)' }}>
                    {item.currentDisposalRate}%
                  </strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>
                    {item.currentDisposed.toLocaleString('en-IN')} / {item.currentReceived.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>
                    {t('historical.historicalBaseline')}
                  </span>
                  <strong style={{ fontSize: '1.125rem', color: 'var(--md-sys-color-primary)' }}>
                    {item.hasHistoricalBaseline ? `${item.historicalDisposalRate}%` : 'N/A'}
                  </strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>
                    {item.hasHistoricalBaseline ? '10-Yr (2016–2026)' : 'No historical row'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: '0.625rem 0 0 0', lineHeight: 1.4 }}>
                {item.trendReason}
              </p>
            </div>

            {/* Footer with Evidence Link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--md-sys-color-border-subtle)', paddingTop: '0.5rem' }}>
              <EvidenceBadge
                evidence={{
                  dataset: item.hasHistoricalBaseline ? 'department_history_2016_2026-02-28' : 'live_dashboard_2026',
                  entity: item.entity,
                  metric: item.hasHistoricalBaseline ? 'historical_disposal_baseline' : 'percent_disposed',
                  value: item.hasHistoricalBaseline ? `${item.historicalDisposalRate}% baseline` : `${item.currentDisposalRate}% live`,
                  period: item.hasHistoricalBaseline ? '2016-01-01 to 2026-02-28' : '2026-01-01 to 2026-08-24',
                  sourceUrl: 'https://www.data.gov.in/resource/department-wise-receipts-disposal-and-pendency-public-grievance-detailed-statistics',
                  sourceNote: 'DARPG 10-year verified statistics.',
                }}
                label={t('historical.auditLineage')}
              />

              {onSelectDepartment && (
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
                  {t('historical.viewDeepDive')} &rarr;
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
