import { Injectable } from '@nestjs/common';
import * as promClient from 'prom-client';

import { getMetricsRegistry } from './metrics.registry';

@Injectable()
export class MetricsService {
  private readonly register = getMetricsRegistry();
  private readonly requestCount = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [this.register],
  });
  private readonly requestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    registers: [this.register],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  });
  private readonly requestErrors = new promClient.Counter({
    name: 'http_request_errors_total',
    help: 'Total number of HTTP requests that returned >= 500',
    labelNames: ['method', 'route', 'status'],
    registers: [this.register],
  });

  registerDefaultMetrics() {
    promClient.collectDefaultMetrics({ register: this.register });
  }

  observeRequest(params: {
    method: string;
    route: string;
    status: number;
    durationSeconds: number;
  }) {
    const status = String(params.status);
    const labels = {
      method: params.method,
      route: params.route,
      status,
    };

    this.requestCount.inc(labels);
    this.requestDuration.observe(labels, params.durationSeconds);

    if (params.status >= 500) {
      this.requestErrors.inc(labels);
    }
  }

  async getMetrics() {
    return this.register.metrics();
  }

  getContentType() {
    return this.register.contentType;
  }
}
