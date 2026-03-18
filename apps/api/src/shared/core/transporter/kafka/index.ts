import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export const setupKafka = async (app: INestApplication) => {
  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'base-service',
        },
      },
    },
    { inheritAppConfig: true },
  );
};
