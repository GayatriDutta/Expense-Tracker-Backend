import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
     constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
