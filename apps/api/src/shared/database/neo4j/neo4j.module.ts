import { Global, Module } from '@nestjs/common';

import { UserRepository } from './repositories/user.repository';
import { Neo4jController } from './neo4j.controller';
import { Neo4jService } from './neo4j.service';

@Global()
@Module({
  controllers: [Neo4jController],
  providers: [Neo4jService, UserRepository],
  exports: [Neo4jService, UserRepository],
})
export class Neo4jModule {}
