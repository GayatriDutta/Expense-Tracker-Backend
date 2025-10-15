import { Body, Controller, Delete, Get, Param, Patch, Post, Query,  Request, Res, UseGuards } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
   constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Request() req, @Body() createExpenseDto: any) {
    return this.expensesService.create(req.user.userId, createExpenseDto);
  }

  @Get()
  findAll( @Request() req,  filters: any) {
    return this.expensesService.findAll(req.user.userId, filters);
  }

  @Get('analytics')
  getAnalytics(@Request() req, @Query('period') period: 'daily' | 'weekly' | 'monthly') {
    return this.expensesService.getAnalytics(req.user.userId, period);
  }

  @Get('export')
  async exportData(@Request() req, @Res() res: Response) {
    const data = await this.expensesService.exportData(req.user.userId);
    
    // Convert to CSV
    const headers = ['Date', 'Amount', 'Description', 'Category', 'Note'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.date,
        row.amount,
        `"${row.description}"`,
        row.category,
        `"${row.note}"`
      ].join(','))
    ].join('\n');

    // res.setHeader('Content-Type', 'text/csv');
    // res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    // res.send(csvContent);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateExpenseDto: any) {
    return this.expensesService.update(id, req.user.userId, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(id, req.user.userId);
  }
}
