import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { SystemOverview } from '../../services/types';
import { Inbox, CheckCircle, Percent, Clock } from 'lucide-react';

export interface ExecutiveKpisProps {
  overview: SystemOverview;
}

export const ExecutiveKpis: React.FC<ExecutiveKpisProps> = ({ overview }) => {
  return (
    <div className="kpi-grid">
      <MetricCard
        title="Total Grievances Received"
        value={overview.received}
        subtitle={`${overview.entities} Tracked Public Entities`}
        icon={<Inbox size={24} />}
        sourceNote={overview.source.sourceNote}
      />

      <MetricCard
        title="Total Grievances Disposed"
        value={overview.disposed}
        subtitle="Throughput across central & state cells"
        icon={<CheckCircle size={24} />}
        accentColor="var(--md-sys-color-risk-low)"
        sourceNote={overview.source.sourceNote}
      />

      <MetricCard
        title="Overall Disposal Rate"
        value={`${overview.disposalRate}%`}
        subtitle="Exceeds 85% national benchmark"
        icon={<Percent size={24} />}
        accentColor="var(--md-sys-color-primary)"
        sourceNote="Calculated as (Total Disposed / Total Received) * 100"
      />

      <MetricCard
        title="Total Active Pendency"
        value={overview.pending}
        subtitle={`${overview.agingBuckets['0_60_days'].toLocaleString('en-IN')} in 0–60 day bucket`}
        icon={<Clock size={24} />}
        accentColor="var(--md-sys-color-risk-medium)"
        sourceNote="Sum of 4 official CPGRAMS aging buckets"
      />
    </div>
  );
};
