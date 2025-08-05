
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerModule } from '@desafio-nest/kafka';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PAYMENTS_DB_HOST'),
        port: configService.get('PAYMENTS_DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('PAYMENTS_DB_NAME'),
        entities: [Payment]
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Payment]),
    KafkaProducerModule.forRoot({
      clientId: 'payments-service-producer',
    })
  ],
  controllers: [PaymentsController],
  providers: [PaymentService],
})
export class AppModule {}
