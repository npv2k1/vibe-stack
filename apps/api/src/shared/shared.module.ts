import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import config from './config/config';
import { CoreModule } from './core/core.module';
import { ScheduleModule } from './core/schedule/schedule.module';
import { SocketModule } from './core/socket/socket.module';
import { MongodbModule } from './database/mongodb/mongodb.module';
import { Neo4jModule } from './database/neo4j/neo4j.module';
import { HttpModule } from './http/http.module';
import { I18nModule } from './i18n/i18n.module';
import { KongModule } from './kong/kong.module';
import { LoggerModule } from './logger/logger.module';
import { MailServiceModule } from './mail-service/mail-service.module';
import { MetricsModule } from './metrics/metrics.module';
import { GraphQLModule } from './graphql';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    I18nModule,
    CoreModule,
    HttpModule, // HTTP module for making external HTTP requests
    GraphQLModule,
    SocketModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    ScheduleModule, // Module cho viec lap lich tac vu bang bull,

    KongModule,
  ],
})
export class SharedModule {}
