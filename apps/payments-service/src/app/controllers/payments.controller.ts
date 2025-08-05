import { Controller, Get, Param, Patch } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { OrderDto, PaymentDto, PaymentStatus } from '@desafio-nest/shared-models';
import { KafkaProducerService } from '@desafio-nest/kafka';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Payment } from '../entities/payment.entity';

@Controller('payments')
export class PaymentsController {

  constructor(private paymentsService: PaymentService, private kafkaProducer: KafkaProducerService) {}

  @Get('/:orderId')
  async getPaymentById(@Param('orderId') orderId: string) {
    console.log("Get Payment By orderId: ", orderId)
    const payment = await this.paymentsService.getPaymentById(orderId);
    return payment;
  }

  @Patch('/:orderId/:status')
  async updatePaymentStatus(@Param('orderId') orderId: string, @Param('status') status: PaymentStatus) {
    const payment = await this.paymentsService.updateStatus(orderId, status);
    return payment;
  }

  @EventPattern('order.payment')
  async orderPayment(@Payload() order: OrderDto) {
    console.log('Payment Requested for OrderId: ', order.id);

    const payment = new Payment();
    payment.orderId = order.id
    payment.userId = order.userId
    payment.createdAt = new Date();
    payment.status = PaymentStatus.PAID;

    this.paymentsService.createPayment(payment)

    this.kafkaProducer.publishEvent("order.delivery", order);

    return {
      success: PaymentStatus.PAID,
      orderId: payment.orderId
    };
  }

  @EventPattern('order.payment.status')
  async paymentStatus(@Payload() payment: PaymentDto) {
    console.log('Payment Status for OrderId: ', payment.orderId, 'Status: ', payment.status);

    this.paymentsService.updateStatus(payment.orderId, payment.status);

    return {
      success: payment.status,
      orderId: payment.orderId
    };
  }

}