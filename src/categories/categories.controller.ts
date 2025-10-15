import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';


@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Request() req, @Body() createCategoryDto: any) {
    return this.categoriesService.create(req.user.userId, createCategoryDto);
  }

  @Get()
  findAll(@Request() req) {
    return this. categoriesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, req.user.userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoriesService.remove(id, req.user.userId);
  }
}
