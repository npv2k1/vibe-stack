import { Module } from '@nestjs/common';

import { HttpModule } from '../http/http.module';

import { KongService } from './kong.service';

@Module({
  imports: [HttpModule],
  providers: [KongService],
  exports: [KongService],
})
export class KongModule {}
