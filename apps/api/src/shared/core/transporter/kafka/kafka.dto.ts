// queue: string, content: any, options: Options.Publish = {}

import { ApiProperty } from '@nestjs/swagger';

export class SendToQueueDto {
  @ApiProperty()
  queue: string;

  @ApiProperty()
  content: any;

  @ApiProperty()
  options: any;
}
