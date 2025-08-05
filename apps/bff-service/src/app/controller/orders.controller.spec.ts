import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { KafkaProducerService } from '@desafio-nest/kafka';

describe('OrdersController', () => {
  let controller: OrdersController;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;
  let kafkaProducer: jest.Mocked<KafkaProducerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: KafkaProducerService,
          useValue: {
            publishEvent: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://orders-service:3000'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
    kafkaProducer = module.get(KafkaProducerService);
  });

  it('should return orders data from orders-service', async () => {
    const mockOrders = [{ id: '1', userId: 'user1' }];

    const mockResponse: AxiosResponse = {
      data: mockOrders,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: null
    };

    httpService.get.mockReturnValue(of(mockResponse));

    const result = await controller.get();

    expect(result).toEqual(mockOrders);
    expect(configService.get).toHaveBeenCalledWith('ORDERS_SERVICE_URL');
    expect(httpService.get).toHaveBeenCalledWith('http://orders-service:3000/orders');
  });
});
