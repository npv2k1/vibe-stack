import { Request, Response } from 'express';

import { METRICS_CONTENT_TYPE } from './metrics.constants';
import type { MetricsService } from './metrics.service';

export const createMetricsExporterMiddleware =
  (metricsService: MetricsService) => async (req: Request, res: Response, next: () => void) => {
    if (req.method !== 'GET') {
      return next();
    }

    const payload = await metricsService.getMetrics();
    res.setHeader('Content-Type', METRICS_CONTENT_TYPE);
    res.status(200).send(payload);
  };
