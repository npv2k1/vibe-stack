import { Request, Response } from 'express';

import type { MetricsService } from './metrics.service';

const METRICS_ROUTE_FALLBACK = 'unknown';

export const createMetricsMiddleware =
  (metricsService: MetricsService, ignorePath: string) =>
  (req: Request, res: Response, next: () => void) => {
    const requestPath = req.path || req.url || '';
    if (requestPath === ignorePath) {
      return next();
    }

    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
      const route = req.route?.path || req.path || METRICS_ROUTE_FALLBACK;
      const durationNs = Number(process.hrtime.bigint() - startTime);
      const durationSeconds = durationNs / 1e9;

      metricsService.observeRequest({
        method: req.method,
        route,
        status: res.statusCode,
        durationSeconds,
      });
    });

    next();
  };
