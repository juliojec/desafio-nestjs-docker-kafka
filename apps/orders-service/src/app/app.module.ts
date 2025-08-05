import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';
import { KafkaProducerModule } from '@desafio-nest/kafka';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('ORDERS_DB_HOST'),
        port: configService.get('ORDERS_DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('ORDERS_DB_NAME'),
        entities: [Order]
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order]),
    KafkaProducerModule.forRoot({
      clientId: 'orders-service-producer',
    })
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class AppModule {}
