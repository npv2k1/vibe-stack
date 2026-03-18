// Shared module

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { json, urlencoded } from 'express';

import { setupSocket } from '@/shared/common/socket/socket';

import { NestConfig } from './config/config.interface';
import { setupNats } from './core/transporter/nats';
import { setupMetrics } from './metrics';
import { setupSwagger } from './swagger';

export { formatDate } from './utils/date';
export { toCurrency } from './utils/number';
export { toSlug } from './utils/string';

export const sharedSetup = async (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('API_PREFIX') || '/api';

  console.log(`Using API prefix: ${apiPrefix}`);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors();
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  await setupSwagger(app);
  await setupSocket(app);
  await setupNats(app);

  await app.startAllMicroservices();

  setupMetrics(app);

  // Listen port
  const nestConfig = configService.get<NestConfig>('nest');
  const port = process.env.PORT || nestConfig?.port || 3000;
  await app
    .listen(port)
    .then(() => {
      console.log(`http://localhost:${port}${apiPrefix}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
