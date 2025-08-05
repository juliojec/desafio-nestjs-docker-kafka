import { Controller, Get, Param } from '@nestjs/common';
import { ExpeditionService } from '../services/expedition.service';
import { OrderDto, ExpeditionStatus } from '@desafio-nest/shared-models';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Expedition } from '../entities/expedition.entity';
import { KafkaProducerService } from '@desafio-nest/kafka';

@Controller('expeditions')
export class ExpeditionsController {

  constructor(private expeditionsService: ExpeditionService, private kafkaProducer: KafkaProducerService) {}

  @Get('/:orderId')
  async getExpeditionsByOrderId(@Param('orderId') orderId: string) {
    console.log("Get Expeditions By OrderId: ", orderId)
    const expedition = await this.expeditionsService.getExpeditionById(orderId);
    return expedition;
  }

  @EventPattern('order.delivery')
  async orderDelivery(@Payload() order: OrderDto) {

    console.log('Order in delivery: ', order.id);

    const expedition = new Expedition();
    expedition.orderId = order.id;
    expedition.userId = order.userId;
    expedition.createdAt = new Date();
    expedition.status = ExpeditionStatus.DELIVERED;

    await this.kafkaProducer.publishEvent('order.completed', order);

    console.log('Order delivered: ', order.id);

    return {
      success: true,
      orderId: order.id,
      message: 'Order delivered successfully'
    };
  }

}