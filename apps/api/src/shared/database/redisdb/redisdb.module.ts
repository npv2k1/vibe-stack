import { Global, Module } from '@nestjs/common';

import { RedisdbController } from './redisdb.controller';
import { RedisdbService } from './redisdb.service';

@Global()
@Module({
  controllers: [RedisdbController],
  providers: [RedisdbService],
  exports: [RedisdbService],
})
export class RedisdbModule {}
