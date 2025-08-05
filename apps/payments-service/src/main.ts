import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payments-service',
        brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
      },
      consumer: {
        groupId: 'payments-service-consumer-group',
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner 
      }
    }
  });
  
  await app.startAllMicroservices();
  
  await app.listen(3003);
}

bootstrap();