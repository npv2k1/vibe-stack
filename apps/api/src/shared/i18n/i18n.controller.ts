import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get('translate')
  async translate(@Query('key') key: string, @Headers('lang') lang?: string) {
    console.log(`Translating key: ${key} for language: ${lang}`);
    return {
      key,
      lang: lang || 'en',
      value: await this.i18n.translate(key),
    };
  }
}
