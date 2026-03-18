import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpService } from '../http/http.service';

interface KongConfig {
  adminUrl: string;
  serviceName: string;
  serviceUrl: string;
  routePath: string;
}

@Injectable()
export class KongService implements OnModuleInit {
  private readonly logger = new Logger(KongService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.registerWithKong();
  }

  private getConfig(): KongConfig {
    const adminUrl =
      this.configService.get<string>('KONG_ADMIN_URL') ||
      'http://localhost:8001';
    const serviceName =
      this.configService.get<string>('KONG_SERVICE_NAME') || 'vaily-api';
    const serviceUrl =
      this.configService.get<string>('KONG_SERVICE_URL') ||
      'http://localhost:4000';
    const routePath =
      this.configService.get<string>('KONG_ROUTE_PATH') || '/api';

    return {
      adminUrl: this.normalizeBaseUrl(adminUrl),
      serviceName,
      serviceUrl,
      routePath: this.normalizeRoutePath(routePath),
    };
  }

  private normalizeBaseUrl(url: string) {
    return url.replace(/\/+$/, '');
  }

  private normalizeRoutePath(path: string) {
    if (!path.startsWith('/')) {
      return `/${path}`;
    }

    return path;
  }

  private async registerWithKong() {
    const config = this.getConfig();

    if (!config.adminUrl) {
      this.logger.warn('KONG_ADMIN_URL is not set; skipping Kong registration');
      return;
    }

    try {
      await this.upsertService(config);
      await this.upsertRoute(config);
      this.logger.log(
        `Kong registration complete: service=${config.serviceName}, route=${config.routePath}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Kong registration failed for service=${config.serviceName}: ${error?.message || error}`,
      );
    }
  }

  private async upsertService(config: KongConfig) {
    const serviceUrl = `${config.adminUrl}/services/${encodeURIComponent(config.serviceName)}`;

    try {
      await this.httpService.get(serviceUrl);
      await this.httpService.patch(serviceUrl, { url: config.serviceUrl });
      this.logger.log(`Kong service updated: ${config.serviceName}`);
    } catch (error: any) {
      if (this.isNotFound(error)) {
        await this.httpService.post(`${config.adminUrl}/services`, {
          name: config.serviceName,
          url: config.serviceUrl,
        });
        this.logger.log(`Kong service created: ${config.serviceName}`);
        return;
      }

      throw error;
    }
  }

  private async upsertRoute(config: KongConfig) {
    const routeName = `${config.serviceName}-route`;
    const routeUrl = `${config.adminUrl}/routes/${encodeURIComponent(routeName)}`;

    try {
      await this.httpService.get(routeUrl);
      await this.httpService.patch(routeUrl, {
        paths: [config.routePath],
        strip_path: false,
      });
      this.logger.log(`Kong route updated: ${routeName}`);
    } catch (error: any) {
      if (this.isNotFound(error)) {
        await this.httpService.post(
          `${config.adminUrl}/services/${encodeURIComponent(config.serviceName)}/routes`,
          {
            name: routeName,
            paths: [config.routePath],
            strip_path: false,
          },
        );
        this.logger.log(`Kong route created: ${routeName}`);
        return;
      }

      throw error;
    }
  }

  private isNotFound(error: any) {
    return error?.response?.status === 404;
  }
}
