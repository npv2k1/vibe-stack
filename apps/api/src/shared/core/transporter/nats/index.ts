import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export const setupNats = async (app: INestApplication) => {
  app.connectMicroservice(
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_SERVERS?.split(',') || [
          'nats://localhost:4222',
        ],
      },
    },
    { inheritAppConfig: true },
  );
};
