import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderDto, OrderStatus } from '@desafio-nest/shared-models';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { KafkaProducerService } from '@desafio-nest/kafka';
import { v4 as uuidv4 } from 'uuid';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {

  constructor(private kafkaProducer: KafkaProducerService, private configService: ConfigService, private httpService: HttpService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido e envia para o Kafka' })
  @ApiBody({ 
    type: OrderDto,
    description: 'Dados do pedido para checkout',
    examples: {
      exemploOrder: {
        summary: 'Pedido Corinthians',
        description: 'Exemplo de pedido com produtos do Corinthians',
        value: {
          id: "a9651129-777a-4a4c-ac6d-ed06186d47d9",
          userId: "user-98765",
          items: [
            {
              id: "item-1",
              name: "Camisa Corinthians",
              price: 199.90,
              quantity: 2
            },
            {
              id: "item-2",
              name: "Boné Gaviões",
              price: 79.90,
              quantity: 1
            }
          ],
          status: "processing"
        }
      }
    }
  })
  async createOrder(@Body() orderData: OrderDto) {
    console.log("Processing Order Create from userId: ", orderData.userId);

    const orderId = uuidv4();
    orderData.id = orderId;

    await this.kafkaProducer.publishEvent("order.checkout", orderData);

    return { orderId, success: true, status: OrderStatus.PROCESSING };
  }

  @Get('/')
  @ApiOperation({ summary: 'Busca todas as Ordens' })
  async get() {
    try {
      console.log("Find All Orders");
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.configService.get('ORDERS_SERVICE_URL')}/orders`)
      );
      
      return response.data;
      
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      throw new Error('Failed to fetch orders from orders service');
    }
  }

  @Get('/:orderId')
  @ApiOperation({ summary: 'Busca uma ordem por ID' })
  @ApiParam({ name: 'orderId', type: String })
  async getOrderById(@Param('orderId') orderId: string) {
    console.log("Find Order from Id: ", orderId);

    const response = await firstValueFrom(this.httpService.get(`${this.configService.get('ORDERS_SERVICE_URL')}/orders/${orderId}`));

    return response.data;
  }

  @Get('/payment/:orderId')
  @ApiOperation({ summary: 'Busca uma ordem por ID' })
  @ApiParam({ name: 'orderId', type: String })
  async getPayment(@Param('orderId') orderId: string) {
    console.log("Find Payment from OrderId: ", orderId);

    const response = await firstValueFrom(this.httpService.get(`${this.configService.get('PAYMENTS_SERVICE_URL')}/payments/${orderId}`));

    return response.data;
  }

  @Get('/expedition/:orderId')
  @ApiOperation({ summary: 'Busca a expedição de um pedido específico' })
  @ApiParam({ name: 'orderId', type: String })
  async getExpedition(@Param('orderId') orderId: string) {
    console.log("Find Expedition from OrderId: ", orderId);

    const response = await firstValueFrom(this.httpService.get(`${this.configService.get('EXPEDITION_SERVICE_URL')}/expeditions/${orderId}`));

    return response.data;
  }

  @Get(':orderId/complete')
  @ApiOperation({ summary: 'Busca todas as informações de um pedido (ordem, pagamento, expedição)' })
  @ApiParam({ name: 'orderId', type: String })
  async getOrder(@Param('orderId') orderId: string) {
    console.log("Find Complete Order from Id: ", orderId);

    const order = await firstValueFrom(this.httpService.get(`http://${this.configService.get('ORDERS_SERVICE_URL')}/orders/${orderId}`));
    const payment = await firstValueFrom(this.httpService.get(`http:/${this.configService.get('PAYMENT_SERVICE_URL')}/payments/${orderId}`));
    const expedition = await firstValueFrom(this.httpService.get(`http://${this.configService.get('EXPEDITION_SERVICE_URL')}/expeditions/${orderId}`));

    return { orderId, ordem: order.data, payment: payment.data, expedition: expedition.data };
  }

}