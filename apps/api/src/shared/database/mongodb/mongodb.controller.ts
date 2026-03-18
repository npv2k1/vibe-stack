import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MongodbService } from './mongodb.service';

@ApiTags('mongodb')
@Controller('mongodb')
export class MongodbController {
  constructor(private readonly mongodbService: MongodbService) {}

  @Get('health')
  healthCheck() {
    const connection: any = this.mongodbService.getConnection();
    connection.db.collections;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      isReady: connection.readyState === 1, // 1 means connected
    };
  }

  @Get('collections')
  async getCollections() {
    const connection: any = this.mongodbService.getConnection();
    const collection: any = await connection.db.listCollections().toArray();
    return collection;
  }
}
