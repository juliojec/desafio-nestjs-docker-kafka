import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExepditionDto, ExpeditionStatus } from '@desafio-nest/shared-models';
import { Expedition } from '../entities/expedition.entity';

@Injectable()
export class ExpeditionService {

  constructor(@InjectRepository(Expedition) private expeditionsRepository: Repository<Expedition>) {}

  async createExpedition(expeditionDto: ExepditionDto): Promise<Expedition> {
    const expedition = this.expeditionsRepository.create({
      orderId: expeditionDto.orderId,
      userId: expeditionDto.userId,
      status: expeditionDto.status || ExpeditionStatus.DELIVERY
    });

    const expeditionDB = await this.expeditionsRepository.save(expedition);
    
    return expeditionDB;
  }

  async getExpeditionById(orderId: string): Promise<Expedition> {
    const expedition = await this.expeditionsRepository.findOne({ where: { orderId } });

    if (!expedition) throw new NotFoundException(`Expedition for orderId ${orderId} not found`);
    
    return expedition;
  }

  async updateStatus(orderId: string, status: ExpeditionStatus): Promise<Expedition> {
    await this.expeditionsRepository.update({ id: orderId }, { status });
    
    const expedition = await this.expeditionsRepository.findOne({ 
      where: { id: orderId } 
    });
    
    return expedition;
  }

}