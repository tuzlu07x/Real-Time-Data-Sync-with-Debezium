import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9093'],
        clientId: 'orders-service',
      },
      consumer: {
        groupId: 'orders-consumer',
        allowAutoTopicCreation: true,
        sessionTimeout: 45000,
        heartbeatInterval: 15000,
        maxBytes: 10485760,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  logger.log('Application started');
}
bootstrap();
