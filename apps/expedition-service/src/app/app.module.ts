import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerModule } from '@desafio-nest/kafka';
import { ExpeditionService } from './services/expedition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expedition } from './entities/expedition.entity';
import { ExpeditionsController } from './controllers/expeditions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('EXPEDITIONS_DB_HOST'),
        port: configService.get('EXPEDITIONS_DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('EXPEDITIONS_DB_NAME'),
        entities: [Expedition]
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Expedition]),
    KafkaProducerModule.forRoot({
      clientId: 'expedition-service-producer',
    })
  ],
  controllers: [ExpeditionsController],
  providers: [ExpeditionService],
})
export class AppModule {}
