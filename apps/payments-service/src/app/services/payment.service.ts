import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDto, PaymentStatus } from '@desafio-nest/shared-models';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {

  constructor(@InjectRepository(Payment) private paymentsRepository: Repository<Payment>) {}

  async createPayment(paymentDto: PaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create({
      orderId: paymentDto.orderId,
      userId: paymentDto.userId,
      status: paymentDto.status || PaymentStatus.PAYMENT_REQUESTED
    });

    const paymentDB = await this.paymentsRepository.save(payment);
    
    return paymentDB;
  }

  async getPaymentById(orderId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { orderId } });

    if (!payment) throw new NotFoundException(`Payment for orderId ${orderId} not found`);
    
    return payment;
  }

  async updateStatus(orderId: string, status: PaymentStatus): Promise<Payment> {
    await this.paymentsRepository.update({ orderId }, { status });
    
    const payment = await this.paymentsRepository.findOne({ 
      where: { orderId } 
    });
    
    if (!payment) throw new NotFoundException(`Payment for orderId ${orderId} not found`);
    
    return payment;
  }

}