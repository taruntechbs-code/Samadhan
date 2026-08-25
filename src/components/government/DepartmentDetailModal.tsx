import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AgingBarChart } from '../common/Charts';
import { MetricCard } from '../common/MetricCard';
import { LoadingSpinner } from '../common/LoadingState';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { fetchDepartmentInsights, fetchDepartmentByName } from '../../services/apiClient';
import { DepartmentInsight } from '../../intelligence/types';
import { DepartmentDetail } from '../../services/types';
import { X, Building2, ExternalLink, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface DepartmentDetailModalProps {
  entityName: string | null;
  onClose: () => void;
}

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  entityName,
  onClose,
}) => {
  const [insight, setInsight] = useState<DepartmentInsight | null>(null);
  const [detail, setDetail] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityName) return;

    setLoading(true);
    Promise.all([
      fetchDepartmentInsights(entityName),
      fetchDepartmentByName(entityName),
    ])
      .then(([ins, det]) => {
        setInsight(ins);
        setDetail(det);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [entityName]);

  if (!entityName) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-dialog)',
          boxShadow: 'var(--shadow-level-3)',
        }}
      >
        <Card variant="standard" style={{ padding: '2rem', position: 'relative' }}>
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-text"
            style={{ position: 'absolute', top: '18px', right: '18px', padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          {loading || !detail ? (
            <LoadingSpinner label={`Loading intelligence profile for ${entityName}...`} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header Profile */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--md-sys-color-primary-container)',
                      color: 'var(--md-sys-color-on-primary-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Building2 size={28} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                        {detail.scope}
                      </span>
                      {insight && <Badge riskLevel={insight.risk.riskLevel} />}
                      {insight && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                          Risk Score: {insight.risk.riskScore}/100
                        </span>
                      )}
                    </div>
                    <h2 className="headline-medium" style={{ fontSize: '1.5rem', color: 'var(--md-sys-color-on-surface)' }}>
                      {detail.entity}
                    </h2>
                  </div>
                </div>

                {insight && <EvidenceBadge evidence={insight.evidence} label="Audit Evidence" />}
              </div>

              {/* Performance KPI Cards */}
              <div className="kpi-grid" style={{ marginBottom: '0' }}>
                <MetricCard
                  title="Grievances Received"
                  value={detail.currentPeriod.received}
                  subtitle="Live 2026 reporting"
                />
                <MetricCard
                  title="Grievances Disposed"
                  value={detail.currentPeriod.disposed}
                  accentColor="var(--md-sys-color-risk-low)"
                />
                <MetricCard
                  title="Disposal Velocity"
                  value={`${detail.currentPeriod.disposalRate}%`}
                  accentColor="var(--md-sys-color-primary)"
                />
                <MetricCard
                  title="Unresolved Pendency"
                  value={detail.currentPeriod.totalPending}
                  subtitle={`${detail.currentPeriod.agingBuckets['0_60_days'].toLocaleString('en-IN')} in 0–60d`}
                  accentColor="var(--md-sys-color-risk-medium)"
                />
              </div>

              {/* Risk Factor Breakdown Table if any points allocated */}
              {insight && insight.risk.factors && insight.risk.factors.length > 0 && (
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} style={{ color: 'var(--md-sys-color-risk-critical)' }} />
                    <span>Deterministic Risk Factor Audit</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {insight.risk.factors.map((fac, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>{fac.explanation}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Observed: {fac.observed} &bull; Benchmark Threshold: {fac.threshold}
                          </div>
                        </div>
                        <span className="chip chip-critical" style={{ fontSize: '0.75rem' }}>
                          +{fac.points} Risk Pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aging Breakdown & Appeals Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: 'var(--radius-card)' }}>
                  <AgingBarChart aging={detail.currentPeriod.agingBuckets} title="Pendency Aging Profile" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {detail.appeals ? (
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: 'var(--radius-card)' }}>
                      <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--md-sys-color-primary)' }}>
                        Official Appeals Snapshot
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <div>
                          <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>Appeals Received</div>
                          <div style={{ fontWeight: 700 }}>{detail.appeals.received.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>Appeals Disposed</div>
                          <div style={{ fontWeight: 700, color: 'var(--md-sys-color-risk-low)' }}>{detail.appeals.disposed.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>Appeal Disposal Rate</div>
                          <div style={{ fontWeight: 700 }}>{detail.appeals.disposalRate}%</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>Appeals Pending</div>
                          <div style={{ fontWeight: 700 }}>{detail.appeals.pending.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {insight && (
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: '1.25rem', borderRadius: 'var(--radius-card)', flex: 1 }}>
                      <h3 className="title-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={16} />
                        <span>Longitudinal Observations</span>
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)' }}>
                        {insight.agingInterpretation} {insight.trendInterpretation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Recommendations */}
              {insight && insight.recommendations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 className="title-medium" style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={18} style={{ color: 'var(--md-sys-color-primary)' }} />
                    <span>Actionable Operational Recommendations</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {insight.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'var(--md-sys-color-surface-container-low)',
                          padding: '1rem 1.25rem',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                        }}
                      >
                        <span className="chip chip-primary" style={{ fontSize: '0.6875rem', alignSelf: 'flex-start' }}>
                          {rec.priority}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)' }}>
                            {rec.action}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.15rem' }}>
                            {rec.rationale}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence & Source Traceability */}
              <div
                style={{
                  borderTop: '1px solid var(--md-sys-color-surface-container-low)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--md-sys-color-on-surface-variant)',
                }}
              >
                <div>
                  Dataset: <code>{detail.source.dataset}</code> &bull; {detail.source.sourceNote}
                </div>
                <a
                  href={detail.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 600 }}
                >
                  <span>Verify at CPGRAMS Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
