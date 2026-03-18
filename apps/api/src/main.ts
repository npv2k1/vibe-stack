import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sharedSetup } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  sharedSetup(app);
}
bootstrap();
