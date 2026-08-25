import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { SystemOverview } from '../../services/types';
import { useTranslation } from '../../i18n';

interface ExecutiveKpisProps {
  overview: SystemOverview;
}

export const ExecutiveKpis: React.FC<ExecutiveKpisProps> = ({ overview }) => {
  const { t } = useTranslation();

  return (
    <div className="kpi-grid">
      <MetricCard
        title={t('gov.totalReceived')}
        value={overview.received}
        subtitle={`${overview.entities} ${t('gov.entitiesTracked')}`}
      />
      <MetricCard
        title={t('gov.totalDisposed')}
        value={overview.disposed}
        subtitle={t('gov.throughputNote')}
        accentColor="var(--md-sys-color-risk-low)"
      />
      <MetricCard
        title={t('gov.overallDisposalRate')}
        value={`${overview.disposalRate}%`}
        subtitle={t('gov.exceedsBenchmark')}
        accentColor="var(--md-sys-color-primary)"
      />
      <MetricCard
        title={t('gov.activeBacklog')}
        value={overview.pending}
        subtitle={`${overview.agingBuckets['0_60_days'].toLocaleString('en-IN')} in 0–60d`}
        accentColor="var(--md-sys-color-risk-medium)"
      />
    </div>
  );
};
