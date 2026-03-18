import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule as NestI18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

import { I18nController } from './i18n.controller';

console.log('I18nModule initialized with translations path:', join(__dirname, 'translations'));

@Global()
@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, 'translations'),
        watch: false,
      },
      resolvers: [
        new HeaderResolver(['lang']),
        AcceptLanguageResolver,
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
      ],
    }),
  ],
  controllers: [I18nController],
  exports: [NestI18nModule],
})
export class I18nModule {}
