import { OrderDto } from '@desafio-nest/shared-models';
import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async publishEvent(topic: string, data: OrderDto) {
    console.log(`Publishing to topic ${topic}:`, JSON.stringify(data));
    return this.kafkaClient.emit(topic, JSON.stringify(data));
  }
  
}