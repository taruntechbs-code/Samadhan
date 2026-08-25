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
} from '../intelligence';

export const apiRouter = Router();

// Helper to safely parse numeric query param
function parseNumberQuery(val: unknown): number | undefined {
  if (typeof val === 'string' && val.trim() !== '') {
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

// ==========================================
// 1. HEALTH & CORE API
// ==========================================

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'samadhan-api',
  });
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
        code: 'INVALID_ENTITY',
        message: 'Entity name is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const insights = getDepartmentInsights(decodedEntity, service);

  if (!insights) {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
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
        code: 'MISSING_QUERY_TEXT',
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
        code: 'INVALID_ENTITY',
        message: 'Entity name is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const seriesList = service.getHistoricalTrends(decodedEntity);

  if (seriesList.length === 0) {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
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
        code: 'INVALID_SORT_KEY',
        message: `Invalid sortBy parameter '${sortBy}'. Valid options: ${validSortKeys.join(', ')}`,
      },
    });
    return;
  }

  if (order !== 'asc' && order !== 'desc') {
    res.status(400).json({
      error: {
        code: 'INVALID_ORDER',
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
  const minDisposalRate = parseNumberQuery(req.query.minDisposalRate);
  const maxDisposalRate = parseNumberQuery(req.query.maxDisposalRate);

  const summaries = service.getDepartmentSummaries({
    scope,
    entity,
    minDisposalRate,
    maxDisposalRate,
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
        code: 'INVALID_ENTITY',
        message: 'Entity name is required.',
      },
    });
    return;
  }

  const decodedEntity = decodeURIComponent(entityParam);
  const detail = service.getDepartmentByName(decodedEntity);

  if (!detail) {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
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

  const criticalPending1YearThreshold = parseNumberQuery(req.query.criticalPending1YearThreshold);
  const criticalDisposalRateThreshold = parseNumberQuery(req.query.criticalDisposalRateThreshold);
  const warningDisposalRateThreshold = parseNumberQuery(req.query.warningDisposalRateThreshold);
  const warningPending180To365Threshold = parseNumberQuery(req.query.warningPending180To365Threshold);

  const attentionList = service.getAttentionRequired(
    {
      criticalPending1YearThreshold,
      criticalDisposalRateThreshold,
      warningDisposalRateThreshold,
      warningPending180To365Threshold,
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
        code: 'INVALID_METRIC',
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
