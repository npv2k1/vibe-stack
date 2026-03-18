import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { MetricsConfig } from '@/shared/config/config.interface';

import { METRICS_DEFAULT_PATH } from './metrics.constants';
import { createMetricsMiddleware } from './metrics.middleware';
import { MetricsService } from './metrics.service';
import { createMetricsExporterMiddleware } from './metrics-exporter.middleware';

export const setupMetrics = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const metricsConfig = configService.get<MetricsConfig>('metrics');

  if (!metricsConfig?.enabled) {
    return;
  }

  const metricsService = app.get(MetricsService);

  if (metricsConfig.includeProcessMetrics) {
    metricsService.registerDefaultMetrics();
  }

  const metricsPath = metricsConfig.path || METRICS_DEFAULT_PATH;
  app.use(metricsPath, createMetricsExporterMiddleware(metricsService));
  app.use(createMetricsMiddleware(metricsService, metricsPath));
};
