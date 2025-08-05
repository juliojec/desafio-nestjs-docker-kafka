import { OrderStatus } from '@desafio-nest/shared-models';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ 
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @Column({ type: 'jsonb' })
  items: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}