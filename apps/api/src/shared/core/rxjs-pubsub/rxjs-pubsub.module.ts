import { Global, Module } from '@nestjs/common';

import { RxjsPubsubService } from './rxjs-pubsub.service';

@Global()
@Module({
  providers: [RxjsPubsubService],
  exports: [RxjsPubsubService],
})
export class RxjsPubsubModule {}
