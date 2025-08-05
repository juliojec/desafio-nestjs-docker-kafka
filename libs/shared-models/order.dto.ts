import { IsArray, IsEnum, IsOptional, IsString, ValidateNested, IsNumber, Min, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PAYMENT_REQUESTED = 'payment_requested',
  PAID = 'paid',
  CANCELED = 'canceled'
}

export enum ExpeditionStatus {
  DELIVERY = 'delivery',
  DELIVERED = 'delivered',
}

export class OrderItem {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class OrderDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class PaymentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  orderId?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}



export class ExepditionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  orderId?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(ExpeditionStatus)
  status?: ExpeditionStatus;
}

