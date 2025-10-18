import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  create(@Request() req, @Body() createBudgetDto: any) {
    return this.budgetService.create(req.user.userId, createBudgetDto);
  }

  @Get()
  findAll(@Request() req, @Query('month') month?: string) {
    if (month) {
      return this.budgetService.findByMonth(req.user.userId, month);
    }
    return this.budgetService.findAll(req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateBudgetDto: any,
  ) {
    return this.budgetService.update(id, req.user.userId, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.budgetService.remove(id, req.user.userId);
  }
}
