import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from 'src/expenses/expenses.service';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { Expense } from 'src/expenses/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Expense])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
