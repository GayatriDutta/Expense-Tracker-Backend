import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';

@Controller('expenses')
export class ExpensesController {
   constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  async findAll(): Promise<Expense[]> {
    return this.expensesService.findAll();
  }
}
