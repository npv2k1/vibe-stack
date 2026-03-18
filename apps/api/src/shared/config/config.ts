import * as dotenv from 'dotenv';
dotenv.config();

import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
    publicDir: 'public',
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'API',
    description: 'API description',
    version: '1.0',
    path: process.env.API_PREFIX || 'api',
  },
  security: {
    expiresIn: '7d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  graphql: {
    schemaDestination: './public/schema.graphql',
    debug: true,
    playgroundEnabled: true,
    sortSchema: true,
  },
  metrics: {
    enabled: process.env.METRICS_ENABLED
      ? process.env.METRICS_ENABLED === 'true'
      : false,
    path: process.env.METRICS_PATH || '/metrics',
    includeProcessMetrics: process.env.METRICS_PROCESS === 'true',
  },
  storage: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'us-east-1',
    accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    bucket: process.env.S3_BUCKET || 'uploads',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE
      ? process.env.S3_FORCE_PATH_STYLE === 'true'
      : true,
  },
  nats: {
    servers: process.env.NATS_SERVERS
      ? process.env.NATS_SERVERS.split(',')
      : ['nats://localhost:4222'],
    url: process.env.NATS_URL || 'nats://localhost:4222',
  },
};

export default (): Config => config;
