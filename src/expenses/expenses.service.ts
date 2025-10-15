import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
      constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(userId: string, expenseData: Expense): Promise<Expense> {

    const expense = this.expensesRepository.create({
      ...expenseData,
      userId,
    });
    return this.expensesRepository.save(expense);
  }

  async findAll(userId: string, filters?: any): Promise<Expense[]> {
    const query = this.expensesRepository.createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .where('expense.userId = :userId', { userId });

    if (filters?.categoryId) {
      query.andWhere('expense.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return query.orderBy('expense.date', 'DESC').getMany();
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    return this.expensesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
  }

  async update(id: string, userId: string, updateData: any): Promise<Expense> {
    await this.expensesRepository.update({ id, userId }, updateData);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.expensesRepository.delete({ id, userId });
  }

  async getAnalytics(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const expenses = await this.findAll(userId);
    
    const categoryTotals = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount);
      return acc;
    }, {});

    // Group by time period
    const timeTotals = expenses.reduce((acc, expense) => {
      let key: string;
      const date = new Date(expense.date);
      
      switch (period) {
        case 'daily':
          key = expense.date;
          break;
        case 'weekly':
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = expense.date.substring(0, 7); // YYYY-MM
          break;
      }
      
      acc[key] = (acc[key] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      categoryTotals,
      timeTotals,
      total,
      count: expenses.length,
      topCategories: Object.entries(categoryTotals)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3),
    };
  }

  async exportData(userId: string): Promise<any[]> {
    const expenses = await this.findAll(userId);
    return expenses.map(expense => ({
      date: expense.date,
      amount: expense.amount,
      description: expense.description,
      category: expense.category?.name || 'Uncategorized',
      note: expense.note,
    }));
  }
}
