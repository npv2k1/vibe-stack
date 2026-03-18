import { ApiProperty } from '@nestjs/swagger';

export class BroadcastMessageRequestDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  message: any;
}
