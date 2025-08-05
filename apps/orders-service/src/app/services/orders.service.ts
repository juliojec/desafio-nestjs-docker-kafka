import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDto, OrderStatus } from '@desafio-nest/shared-models';

@Injectable()
export class OrdersService {

  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>) {}

  async createOrder(orderData: OrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      userId: orderData.userId,
      status: orderData.status || OrderStatus.PROCESSING,
      items: orderData.items
    });

    const savedOrder = await this.ordersRepository.save(order);
    
    return savedOrder;
  }

  async getAll(): Promise<Order[]> {
    const orders = await this.ordersRepository.find();
    return orders;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) throw new NotFoundException(`Pedido com ID ${orderId} não encontrado`);
    
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await this.ordersRepository.update({ id: orderId }, { status });
    
    const updatedOrder = await this.ordersRepository.findOne({ 
      where: { id: orderId } 
    });
    
    return updatedOrder;
  }

}