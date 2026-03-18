import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendToQueueDto } from './kafka.dto';
import { KafkaService } from './kafka.service';

@ApiTags('Kafka')
@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('publish')
  async publish(@Body() body: SendToQueueDto) {
    console.log('Publishing to Kafka:', body);
    return this.kafkaService.publish(body.queue, JSON.stringify(body.content));
  }
}
