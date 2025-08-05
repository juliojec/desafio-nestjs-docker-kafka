import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('KAFKA_BROKER:', process.env.KAFKA_BROKER);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'orders-service',
        brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
      },
      consumer: {
        groupId: 'orders-service-consumer-group',
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner 
      }
    }
  });
  
  await app.startAllMicroservices();
  
  await app.listen(3001);
}

bootstrap();