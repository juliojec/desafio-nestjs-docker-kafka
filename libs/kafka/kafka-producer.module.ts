import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './services/kafka-producer.service';

export interface KafkaProducerOptions {
  clientId: string;
}

@Module({})
export class KafkaProducerModule {
  static forRoot(options: KafkaProducerOptions): DynamicModule {
    return {
      module: KafkaProducerModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'KAFKA_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
              const kafkaBroker = configService.get("KAFKA_BROKER");
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: options.clientId,
                    brokers: [kafkaBroker] ,
                    retry: {
                      initialRetryTime: 1000,
                      retries: 10,
                      maxRetryTime: 30000,
                      factor: 2,
                    },
                  },
                  producer: {
                    allowAutoTopicCreation: true,
                    transactionTimeout: 30000,
                  },
                }
              };
            },
            inject: [ConfigService],
          }
        ]),
      ],
      providers: [KafkaProducerService],
      exports: [KafkaProducerService, ClientsModule],
    };
  }
}