import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './controller/orders.controller';
import { HttpModule } from '@nestjs/axios';
import { KafkaProducerModule } from '@desafio-nest/kafka';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    HttpModule,
    KafkaProducerModule.forRoot({
      clientId: 'bff-service-producer',
    })
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpExceptionInterceptor,
    },
  ],
})
export class AppModule {}
