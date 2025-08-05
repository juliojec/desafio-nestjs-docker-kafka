import { PaymentStatus } from '@desafio-nest/shared-models';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ 
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAYMENT_REQUESTED 
  })
  status: PaymentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}