export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  graphql: GraphqlConfig;
  storage: StorageConfig;
  metrics: MetricsConfig;
  nats: NatsConfig;
}

export interface NestConfig {
  port: number;
  publicDir: string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface StorageConfig {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  forcePathStyle: boolean;
}

export interface MetricsConfig {
  enabled: boolean;
  path: string;
  includeProcessMetrics: boolean;
}

export interface NatsConfig {
  servers: string[];
  url?: string;
}
