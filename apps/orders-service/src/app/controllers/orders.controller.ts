import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { KafkaProducerService } from '@desafio-nest/kafka';
import { OrderDto, OrderStatus } from '@desafio-nest/shared-models';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService, private kafkaProducer: KafkaProducerService) {}

  @Get('/:id')
  async getOrderById(@Param('id') id: string) {
    console.log("Get Order By Id: ", id)
    const order = await this.ordersService.getOrderById(id);
    return order;
  }

  @Get('/')
  async getAll() {
    console.log("Get All Order ")
    const order = await this.ordersService.getAll();
    return order;
  }

  @EventPattern('order.checkout')
  async orderCheckout(@Payload() data: OrderDto) {

    console.log('Order Checkout Topic', data);

    const order = data;
    
    const orderBD = await this.ordersService.createOrder(order);

    console.log('Order processing and save: ', orderBD.id);

    await this.kafkaProducer.publishEvent('order.payment', orderBD);

    console.log('Order emited to payment: ', orderBD.id);

    return {
      success: true,
      orderId: orderBD.id,
      message: 'Order processed successfully'
    };
  }

  @EventPattern('order.completed')
  async orderComplete(@Payload() data: OrderDto) {
    
    const orderBD = await this.ordersService.updateStatus(data.id, OrderStatus.COMPLETED);

    console.log('Order completed and save: ', orderBD.id);

    return {
      success: true,
      orderId: orderBD.id,
      message: 'Order completed successfully'
    };
  }

}