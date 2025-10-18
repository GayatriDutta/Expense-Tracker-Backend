import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
  ) {}

  async create(userId: string, budgetData: Budget): Promise<Budget> {
    const budget = this.budgetsRepository.create({
      ...budgetData,
      userId,
    });
    return this.budgetsRepository.save(budget);
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetsRepository.find({
      where: { userId },
      relations: ['category'],
      order: { month: 'DESC' },
    });
  }

  async findByMonth(userId: string, month: string): Promise<Budget[]> {
    return this.budgetsRepository.find({
      where: { userId, month, isActive: true },
      relations: ['category'],
    });
  }

  async update(id: string, userId: string, updateData: any): Promise<Budget> {
    await this.budgetsRepository.update({ id, userId }, updateData);
    return this.budgetsRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.budgetsRepository.delete({ id, userId });
  }
}
