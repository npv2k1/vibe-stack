import { Controller, Get } from '@nestjs/common';

import { HttpService } from './http.service';

@Controller('http')
export class HttpController {
  constructor(private readonly httpService: HttpService) {}

  @Get('health')
  async health() {
    return this.httpService.get('https://whoami.vdaily.app').then((res) => res.data);
  }
}
