/**
 * SAMADHAN — Backend API Route Handlers
 * Maps HTTP requests directly to CpgramsService and Intelligence Engine without duplicating analytical logic.
 */

import { Router, Request, Response } from 'express';
import { getServerCpgramsService } from './serviceInit';
import { SortableDepartmentMetric } from '../services/types';
import { ALL_KNOWN_METRICS } from '../data/types';
import {
  getSystemInsights,
  getDepartmentInsights,
  routeGrievanceText,
  calculateDepartmentRisk,
  generateDepartmentRecommendations,
  TrendInsight,
  SystemMetadata,
} from '../intelligence';
import { searchFacilities, getFacilityById } from '../data/facilityDirectory';
import { getAllDatasets } from '../data/datasetRegistry';
import {
  getDepartmentHistoricalComparison,
  getAllHistoricalComparisons,
  getHistoricalSystemOverview,
} from '../data/cpgramsHistorical';
import { getMunicipalCaseStudy } from '../data/municipal/pcmc';

export const apiRouter = Router();

// Helper to safely parse numeric query param with range validation
function parseNumberQuery(val: unknown, min?: number, max?: number): { value?: number; error?: string } {
  if (typeof val === 'string' && val.trim() !== '') {
    const num = Number(val);
    if (isNaN(num)) {
      return { error: `Value '${val}' is not a valid number.` };
    }
    if (min !== undefined && num < min) {
      return { error: `Value ${num} is less than minimum allowed (${min}).` };
    }
    if (max !== undefined && num > max) {
      return { error: `Value ${num} is greater than maximum allowed (${max}).` };
    }
    return { value: num };
  }
  return {};
}

// ==========================================
// 1. HEALTH & METADATA
// ==========================================

apiRouter.get('/health', (_req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const entities = service.getAvailableEntities();
  const metrics = service.getAvailableMetrics();

  res.json({
    status: 'ok',
    service: 'samadhan-api',
    version: '0.6.0',
    dataset: {
      loaded: true,
      rows: 2134,
      entitiesCount: entities.length,
      metricsCount: metrics.length,
      livePeriod: '2026-01-01 to 2026-08-24',
    },
    intelligence: {
      riskEngine: 'active (deterministic)',
      recommendationEngine: 'active (rule-driven)',
      routingEngine: 'active (taxonomy-heuristic prototype)',
    },
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/meta', (_req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const entities = service.getAvailableEntities();
  const metrics = service.getAvailableMetrics();

  const metadata: SystemMetadata = {
    version: '0.6.0',
    name: 'SAMADHAN — Public Grievance Redressal & Intelligence Platform',
    description: 'Civic-tech modernization of India’s CPGRAMS public grievance experience.',
    event: 'Build What Moves India',
    totalRowsParsed: 2134,
    reportingEntitiesCount: entities.length,
    availableDatasets: [
      'live_dashboard_2026',
      'appeal_dashboard_2026-08-25',
      'department_history_2016_2026-02-28',
      'state_history_2016_2026-02-28',
      'state_cpgrams_2020_2024',
      'year_wise_cpgrams',
      'monthly_central_2026',
      'monthly_states_ut_2026',
    ],
    availableMetrics: metrics,
    livePeriod: '2026-01-01 to 2026-08-24',
    intelligenceEngineVersion: '2.0.0-phase6',
    methodology: {
      riskScoring: 'Deterministic 0-100 scoring based on disposal velocity benchmarks, chronic 1-year pendency, and 180-365 day aging volume.',
      routingModel: 'Deterministic word-boundary taxonomy matching mapping citizen problem vocabulary to 278 real public authorities.',
      datasetIntegrity: 'Strict dataset isolation; live dashboards, monthly central reports, 10-year longitudinal series, and appeals are maintained in separate analytical partitions.',
    },
  };

  res.json(metadata);
});

// ==========================================
// 2. ACTIONABLE INTELLIGENCE ENDPOINTS
// ==========================================

// GET /api/intelligence/overview
apiRouter.get('/intelligence/overview', (_req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const systemInsights = getSystemInsights(service);
  res.json(systemInsights);
});

// GET /api/intelligence/attention
apiRouter.get('/intelligence/attention', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const dataset = (req.query.dataset as string) || 'live_dashboard_2026';
  const scope = req.query.scope as string | undefined;

  const rawAttention = service.getAttentionRequired(undefined, { dataset, scope });

  // Enhance each attention item with risk score & actionable recommendations
  const enriched = rawAttention.map(item => {
    const periodMetric = service.getDepartmentRanking('received', 'desc', { dataset, scope }).find(
      m => m.entity.toLowerCase() === item.entity.toLowerCase()
    );

    const risk = periodMetric ? calculateDepartmentRisk(periodMetric) : null;
    const recommendations = periodMetric ? generateDepartmentRecommendations(periodMetric) : [];

    return {
      entity: item.entity,
      scope: item.scope,
      dataset: item.dataset,
      severity: item.severity,
      riskScore: risk?.riskScore || 0,
      reasons: [item.reason],
      factors: risk?.factors || [],
      recommendations,
      evidence: risk?.evidence || [],
    };
  });

  res.json({
    totalCount: enriched.length,
    criticalCount: enriched.filter(e => e.severity === 'CRITICAL').length,
    warningCount: enriched.filter(e => e.severity === 'WARNING').length,
    items: enriched,
  });
});

// GET /api/intelligence/departments/:entity
apiRouter.get('/intelligence/departments/:entity', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const rawEntity = req.params.entity;
  const entityParam = Array.isArray(rawEntity) ? rawEntity[0] : rawEntity;

  if (!entityParam || typeof entityParam !== 'string' || entityParam.trim() === '') {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Entity name parameter is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const insights = getDepartmentInsights(decodedEntity, service);

  if (!insights) {
    res.status(404).json({
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: `Department '${decodedEntity}' not found in CPGRAMS dataset.`,
      },
    });
    return;
  }

  res.json(insights);
});

// GET /api/intelligence/routing?text=...
apiRouter.get('/intelligence/routing', (req: Request, res: Response) => {
  const textQuery = req.query.text as string | undefined;

  if (!textQuery || typeof textQuery !== 'string' || textQuery.trim() === '') {
    res.status(400).json({
      error: {
        code: 'ROUTING_INPUT_REQUIRED',
        message: 'Query parameter "text" is required for grievance routing.',
      },
    });
    return;
  }

  const recommendation = routeGrievanceText(textQuery);
  res.json(recommendation);
});

// GET /api/intelligence/trends/:entity
apiRouter.get('/intelligence/trends/:entity', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const rawEntity = req.params.entity;
  const entityParam = Array.isArray(rawEntity) ? rawEntity[0] : rawEntity;

  if (!entityParam || typeof entityParam !== 'string' || entityParam.trim() === '') {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Entity name parameter is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const seriesList = service.getHistoricalTrends(decodedEntity);

  if (seriesList.length === 0) {
    res.status(404).json({
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: `No trend data found for entity '${decodedEntity}'.`,
      },
    });
    return;
  }

  const trendInsights: TrendInsight[] = seriesList.map(s => {
    let direction: TrendInsight['direction'] = 'STABLE';
    let summary = `Longitudinal series for ${s.dataset} spanning ${s.points.length} reporting snapshot(s).`;

    if (s.points.length >= 2) {
      const first = s.points[0].metrics['percent_disposed'] || s.points[0].metrics['disposed'] || 0;
      const last = s.points[s.points.length - 1].metrics['percent_disposed'] || s.points[s.points.length - 1].metrics['disposed'] || 0;
      if (last > first) {
        direction = 'IMPROVING';
        summary = `Performance trajectory has improved across the ${s.dataset} series.`;
      } else if (last < first) {
        direction = 'DECLINING';
        summary = `Performance trajectory reflects a decline across the ${s.dataset} series.`;
      }
    }

    return {
      entity: decodedEntity,
      dataset: s.dataset,
      direction,
      summary,
      pointsCount: s.points.length,
      evidence: [
        {
          dataset: s.dataset,
          entity: decodedEntity,
          metric: 'historical_series',
          value: s.points.length,
          period: s.points.map(p => p.label).join(', '),
          sourceUrl: s.source.sourceUrl,
          sourceNote: s.source.sourceNote,
        },
      ],
    };
  });

  res.json({
    entity: decodedEntity,
    seriesCount: trendInsights.length,
    trends: trendInsights,
  });
});

// ==========================================
// 3. STATISTICAL & DATA ENDPOINTS
// ==========================================

// GET /api/overview
apiRouter.get('/overview', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const dataset = (req.query.dataset as string) || 'live_dashboard_2026';
  const scope = req.query.scope as string | undefined;

  const overview = service.getSystemOverview(dataset, scope ? { scope } : undefined);
  res.json(overview);
});

// GET /api/departments/ranking
apiRouter.get('/departments/ranking', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const sortBy = (req.query.sortBy as SortableDepartmentMetric) || 'received';
  const order = (req.query.order as 'asc' | 'desc') || 'desc';

  const validSortKeys: SortableDepartmentMetric[] = [
    'received',
    'disposed',
    'disposalRate',
    'totalPending',
    'pending_more_than_1_year',
  ];

  if (!validSortKeys.includes(sortBy)) {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: `Invalid sortBy parameter '${sortBy}'. Valid options: ${validSortKeys.join(', ')}`,
      },
    });
    return;
  }

  if (order !== 'asc' && order !== 'desc') {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: `Invalid order parameter '${order}'. Valid options: 'asc', 'desc'`,
      },
    });
    return;
  }

  const scope = req.query.scope as string | undefined;
  const dataset = req.query.dataset as string | undefined;

  const ranking = service.getDepartmentRanking(sortBy, order, { scope, dataset });
  res.json({
    sortBy,
    order,
    count: ranking.length,
    ranking,
  });
});

// GET /api/departments
apiRouter.get('/departments', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const scope = req.query.scope as string | undefined;
  const entity = req.query.entity as string | undefined;

  const minDisp = parseNumberQuery(req.query.minDisposalRate, 0, 100);
  if (minDisp.error) {
    res.status(400).json({ error: { code: 'INVALID_PARAMETER', message: `minDisposalRate: ${minDisp.error}` } });
    return;
  }

  const maxDisp = parseNumberQuery(req.query.maxDisposalRate, 0, 100);
  if (maxDisp.error) {
    res.status(400).json({ error: { code: 'INVALID_PARAMETER', message: `maxDisposalRate: ${maxDisp.error}` } });
    return;
  }

  const summaries = service.getDepartmentSummaries({
    scope,
    entity,
    minDisposalRate: minDisp.value,
    maxDisposalRate: maxDisp.value,
  });

  res.json({
    count: summaries.length,
    departments: summaries,
  });
});

// GET /api/departments/:entity
apiRouter.get('/departments/:entity', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const rawEntity = req.params.entity;
  const entityParam = Array.isArray(rawEntity) ? rawEntity[0] : rawEntity;

  if (!entityParam || typeof entityParam !== 'string' || entityParam.trim() === '') {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Entity name parameter is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const detail = service.getDepartmentByName(decodedEntity);

  if (!detail) {
    res.status(404).json({
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: `Department '${decodedEntity}' not found in CPGRAMS dataset.`,
      },
    });
    return;
  }

  res.json(detail);
});

// GET /api/attention
apiRouter.get('/attention', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const dataset = req.query.dataset as string | undefined;
  const scope = req.query.scope as string | undefined;

  const crit1yr = parseNumberQuery(req.query.criticalPending1YearThreshold, 0);
  const critDisp = parseNumberQuery(req.query.criticalDisposalRateThreshold, 0, 100);
  const warnDisp = parseNumberQuery(req.query.warningDisposalRateThreshold, 0, 100);
  const warn180 = parseNumberQuery(req.query.warningPending180To365Threshold, 0);

  const attentionList = service.getAttentionRequired(
    {
      criticalPending1YearThreshold: crit1yr.value,
      criticalDisposalRateThreshold: critDisp.value,
      warningDisposalRateThreshold: warnDisp.value,
      warningPending180To365Threshold: warn180.value,
    },
    { dataset, scope }
  );

  const criticalCount = attentionList.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = attentionList.filter(a => a.severity === 'WARNING').length;

  res.json({
    totalCount: attentionList.length,
    criticalCount,
    warningCount,
    items: attentionList,
  });
});

// GET /api/aging
apiRouter.get('/aging', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const entity = req.query.entity as string | undefined;
  const dataset = (req.query.dataset as string) || 'live_dashboard_2026';

  const aging = service.getAgingAnalysis(entity, dataset);
  res.json({
    entity: entity || 'System-wide',
    dataset,
    aging,
  });
});

// GET /api/trends
apiRouter.get('/trends', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const entity = req.query.entity as string | undefined;
  const dataset = req.query.dataset as string | undefined;

  const trends = service.getHistoricalTrends(entity, dataset);
  res.json({
    entity: entity || 'All Entities',
    dataset: dataset || 'All Datasets',
    seriesCount: trends.length,
    series: trends,
  });
});

// GET /api/appeals
apiRouter.get('/appeals', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const entity = req.query.entity as string | undefined;

  const appeals = service.getAppealsOverview(entity ? { entity } : undefined);
  res.json(appeals);
});

// GET /api/entities
apiRouter.get('/entities', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const scope = req.query.scope as string | undefined;
  const dataset = req.query.dataset as string | undefined;

  const entities = service.getAvailableEntities({ scope, dataset });
  res.json({
    count: entities.length,
    entities,
  });
});

// GET /api/periods
apiRouter.get('/periods', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const dataset = req.query.dataset as string | undefined;

  const periods = service.getAvailablePeriods(dataset);
  res.json({
    count: periods.length,
    periods,
  });
});

// GET /api/metrics
apiRouter.get('/metrics', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const dataset = req.query.dataset as string | undefined;

  const metrics = service.getAvailableMetrics(dataset);
  res.json({
    count: metrics.length,
    metrics,
  });
});

// GET /api/metrics/:metric
apiRouter.get('/metrics/:metric', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const rawMetric = req.params.metric;
  const metricParam = (Array.isArray(rawMetric) ? rawMetric[0] : rawMetric || '').toLowerCase().trim();

  const availableMetrics = service.getAvailableMetrics();
  const isKnown = (ALL_KNOWN_METRICS as readonly string[]).includes(metricParam) || availableMetrics.includes(metricParam);

  if (!isKnown) {
    res.status(400).json({
      error: {
        code: 'METRIC_NOT_FOUND',
        message: `Metric '${metricParam}' does not exist in the CPGRAMS dataset.`,
      },
    });
    return;
  }

  const scope = req.query.scope as string | undefined;
  const entity = req.query.entity as string | undefined;
  const dataset = req.query.dataset as string | undefined;
  const periodStart = req.query.periodStart as string | undefined;
  const periodEnd = req.query.periodEnd as string | undefined;

  const rows = service.getMetric(metricParam, {
    scope,
    entity,
    dataset,
    periodStart,
    periodEnd,
  });

  res.json({
    metric: metricParam,
    count: rows.length,
    rows,
  });
});

// ==========================================
// 4. FACILITY DIRECTORY ENRICHMENT ENDPOINTS
// ==========================================

// GET /api/facilities/search?q=...&state=...&district=...&subdistrict=...&facilityType=...&limit=...
apiRouter.get('/facilities/search', (req: Request, res: Response) => {
  const rawQ = req.query.q as string | undefined;
  if (rawQ && rawQ.length > 200) {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Search query parameter "q" cannot exceed 200 characters.',
      },
    });
    return;
  }

  const limitParam = parseNumberQuery(req.query.limit, 1, 50);
  if (limitParam.error) {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: `limit: ${limitParam.error}`,
      },
    });
    return;
  }

  const result = searchFacilities({
    q: rawQ,
    state: req.query.state as string | undefined,
    district: req.query.district as string | undefined,
    subdistrict: req.query.subdistrict as string | undefined,
    facilityType: req.query.facilityType as string | undefined,
    limit: limitParam.value || 10,
  });

  res.json({
    source: 'facility_directory',
    sourceNote: 'National public healthcare facility directory for geographic jurisdiction resolution.',
    total: result.total,
    limit: result.limit,
    results: result.results,
  });
});

// GET /api/facilities/:id
apiRouter.get('/facilities/:id', (req: Request, res: Response) => {
  const rawId = req.params.id;
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!idParam || typeof idParam !== 'string' || idParam.trim() === '') {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Facility ID parameter is required.',
      },
    });
    return;
  }

  const facility = getFacilityById(idParam);
  if (!facility) {
    res.status(404).json({
      error: {
        code: 'FACILITY_NOT_FOUND',
        message: `Facility with ID '${idParam}' was not found in the directory.`,
      },
    });
    return;
  }

  res.json({
    source: 'facility_directory',
    facility,
  });
});

// ==========================================
// 14. DATASET REGISTRY & PROVENANCE
// ==========================================

// GET /api/datasets
apiRouter.get('/datasets', (_req: Request, res: Response) => {
  const datasets = getAllDatasets();
  res.json({
    total: datasets.length,
    datasets,
  });
});

// ==========================================
// 15. HISTORICAL INTELLIGENCE & BASELINES
// ==========================================

// GET /api/historical/overview
apiRouter.get('/historical/overview', (_req: Request, res: Response) => {
  const service = getServerCpgramsService();
  const overview = getHistoricalSystemOverview(service);
  res.json({
    source: 'cpgrams_historical_10yr',
    overview,
  });
});

// GET /api/historical/trends
apiRouter.get('/historical/trends', (req: Request, res: Response) => {
  const service = getServerCpgramsService();
  let comparisons = getAllHistoricalComparisons(service);

  const rawTrend = req.query.trend;
  const trendParam = (typeof rawTrend === 'string' ? rawTrend : Array.isArray(rawTrend) ? rawTrend[0] : '') as string;
  if (trendParam) {
    const validTrends = ['IMPROVING', 'STABLE', 'DETERIORATING', 'INSUFFICIENT_HISTORY'];
    if (!validTrends.includes(trendParam.toUpperCase())) {
      res.status(400).json({
        error: {
          code: 'INVALID_PARAMETER',
          message: `Trend must be one of: ${validTrends.join(', ')}`,
        },
      });
      return;
    }
    comparisons = comparisons.filter(c => c.trend === trendParam.toUpperCase());
  }

  const rawLimit = req.query.limit;
  const limitParam = parseNumberQuery(typeof rawLimit === 'string' ? rawLimit : Array.isArray(rawLimit) ? rawLimit[0] : undefined, 1, 100);
  if (limitParam.error) {
    res.status(400).json({ error: { code: 'INVALID_PARAMETER', message: limitParam.error } });
    return;
  }

  const limit = limitParam.value || 50;
  res.json({
    source: 'cpgrams_historical_10yr',
    total: comparisons.length,
    limit,
    results: comparisons.slice(0, limit),
  });
});

// GET /api/historical/departments/:entity
apiRouter.get('/historical/departments/:entity', (req: Request, res: Response) => {
  const rawEntity = req.params.entity;
  const entityParam = Array.isArray(rawEntity) ? rawEntity[0] : rawEntity;

  if (!entityParam || typeof entityParam !== 'string' || entityParam.trim() === '') {
    res.status(400).json({
      error: { code: 'INVALID_PARAMETER', message: 'Entity parameter is required.' },
    });
    return;
  }

  const service = getServerCpgramsService();
  const profile = getDepartmentHistoricalComparison(entityParam, service);

  if (!profile) {
    res.status(404).json({
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: `Entity '${entityParam}' was not found in active reporting departments.`,
      },
    });
    return;
  }

  res.json({
    source: 'cpgrams_historical_10yr',
    profile,
  });
});

// GET /api/historical/compare/:entity
apiRouter.get('/historical/compare/:entity', (req: Request, res: Response) => {
  const rawEntity = req.params.entity;
  const entityParam = Array.isArray(rawEntity) ? rawEntity[0] : rawEntity;

  if (!entityParam || typeof entityParam !== 'string' || entityParam.trim() === '') {
    res.status(400).json({
      error: { code: 'INVALID_PARAMETER', message: 'Entity parameter is required.' },
    });
    return;
  }

  const service = getServerCpgramsService();
  const profile = getDepartmentHistoricalComparison(entityParam, service);

  if (!profile) {
    res.status(404).json({
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: `Entity '${entityParam}' was not found for comparison.`,
      },
    });
    return;
  }

  res.json({
    entity: profile.entity,
    hasHistoricalBaseline: profile.hasHistoricalBaseline,
    current: {
      disposalRate: profile.currentDisposalRate,
      received: profile.currentReceived,
      disposed: profile.currentDisposed,
      pending: profile.currentPending,
      period: '2026-01-01 to 2026-08-24',
    },
    historical: profile.hasHistoricalBaseline
      ? {
          disposalRate: profile.historicalDisposalRate,
          received: profile.historicalTotalReceived,
          redressed: profile.historicalTotalRedressed,
          avgDisposalDays: profile.historicalAverageDisposalDays,
          period: profile.historicalPeriod,
        }
      : null,
    comparison: {
      varianceDisposalRate: profile.varianceDisposalRate,
      trend: profile.trend,
      trendReason: profile.trendReason,
    },
    evidence: profile.evidence,
  });
});

// ==========================================
// 16. MUNICIPAL CASE STUDY (PCMC)
// ==========================================

// GET /api/municipal/pcmc
apiRouter.get('/municipal/pcmc', (_req: Request, res: Response) => {
  const caseStudy = getMunicipalCaseStudy();
  res.json({
    source: 'pcmc_municipal_case_study_2025',
    caseStudy,
  });
});

// ==========================================
// 17. DOCUMENT EVIDENCE & RAG ENDPOINTS
// ==========================================

import {
  ExtractedDocument,
  aggregateMultiDocumentEvidence,
  retrieveRelevantChunks,
} from '../intelligence';

// POST /api/evidence/analyze
apiRouter.post('/evidence/analyze', (req: Request, res: Response) => {
  const { queryText, documents } = req.body;

  if (!documents || !Array.isArray(documents)) {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Request body must include an array of documents.',
      },
    });
    return;
  }

  // Validate document array constraints (max 5)
  if (documents.length > 5) {
    res.status(400).json({
      error: {
        code: 'MAX_FILES_EXCEEDED',
        message: 'Maximum 5 evidence documents can be attached per grievance.',
      },
    });
    return;
  }

  const multiEvidence = aggregateMultiDocumentEvidence(documents as ExtractedDocument[], queryText);
  const routing = routeGrievanceText(queryText || '', multiEvidence);

  res.json({
    status: 'ok',
    totalAnalyzed: multiEvidence.totalAnalyzed,
    evidence: multiEvidence,
    routing,
  });
});

// POST /api/evidence/retrieve
apiRouter.post('/evidence/retrieve', (req: Request, res: Response) => {
  const { queryText, document } = req.body;

  if (!queryText || typeof queryText !== 'string' || !document) {
    res.status(400).json({
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Query text and document object are required.',
      },
    });
    return;
  }

  const retrieval = retrieveRelevantChunks(queryText, document as ExtractedDocument);

  res.json({
    status: 'ok',
    retrieval,
  });
});



