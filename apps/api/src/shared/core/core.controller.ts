import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Resolve } from './interceptors/resolve.interceptor';
import { NatsClientService } from './transporter/nats/nats.client.service';

@ApiTags('Core')
@Controller('')
export class CoreControler {

  constructor(private readonly natsClientService: NatsClientService) {}

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ping')
  ping() {
    // return 'pong';
    this.natsClientService.send('auth.login', { email: 'npv2k1@gmail.com', password: "12345678" });
  }

  @Get('exception')
  testException() {
    throw new Error('Test exception');
  }

  @Get('jobs')
  getJobs() {
    return 'jobs';
  }

  @Resolve((data) => {
    return {
      name: 'hello',
    };
  })
  @Get('resolve')
  testResolve() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));
  }
}
