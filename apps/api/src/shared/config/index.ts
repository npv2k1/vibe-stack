import { ConfigModule } from '@nestjs/config';

import config from './config';

export const sharedConfig = () =>
  ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  });
