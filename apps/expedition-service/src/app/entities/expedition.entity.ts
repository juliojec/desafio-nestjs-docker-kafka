import { ExpeditionStatus } from '@desafio-nest/shared-models';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expeditions')
export class Expedition {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ 
    type: 'enum',
    enum: ExpeditionStatus,
    default: ExpeditionStatus.DELIVERY 
  })
  status: ExpeditionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}