import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendMailDto } from './dtos/send-mail.dto';
import { MailServiceService } from './mail-service.service';

@ApiTags('MailService')
@Controller('mail-service')
export class MailServiceController {
  constructor(private readonly mailServiceService: MailServiceService) {}

  @Get('ping')
  async ping() {
    return await this.mailServiceService.ping();
  }

  @Post('send')
  async send(@Body() body: SendMailDto) {
    return await this.mailServiceService.send(body);
  }
}
