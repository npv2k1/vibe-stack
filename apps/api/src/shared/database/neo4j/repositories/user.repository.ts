import { Injectable } from '@nestjs/common';

import { BaseNeo4jRepository } from '../common/base.neo4j.repository';
import { User } from '../models/user.entity';
import { Neo4jService } from '../neo4j.service';

@Injectable()
export class UserRepository extends BaseNeo4jRepository<User> {
  constructor(neo4jService: Neo4jService) {
    super(neo4jService, 'User');
  }
}
