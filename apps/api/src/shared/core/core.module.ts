import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { CryptoModule } from './crypto/crypto.module';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { ResolveInterceptor } from './interceptors/resolve.interceptor';
import { TransformInterceptor } from './interceptors/transftorm.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { RxjsPubsubModule } from './rxjs-pubsub/rxjs-pubsub.module';
import { KafkaModule } from './transporter/kafka/kafka.module';
import { NatsModule } from './transporter/nats/nats.module';
import { RabbitMqModule } from './transporter/rabbitmq/rabbitmq.module';
import { RedisModule } from './transporter/redis/redis.module';
import { CoreControler } from './core.controller';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResolveInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // Using useClass instead of useValue
    },
  ],
  controllers: [CoreControler],
  exports: [],
  imports: [
    CryptoModule,
    RxjsPubsubModule,
    NatsModule,
    RabbitMqModule,
    KafkaModule,
    RedisModule,
  ],
})
export class CoreModule {}
