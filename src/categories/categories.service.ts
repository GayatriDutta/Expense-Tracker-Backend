import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  private async seedDefaultCategories() {
    const defaultCategories = [
      { name: 'All Categories', color: '#EF4444', icon: '📦' },
      { name: 'Food & Dining', color: '#EF4444', icon: '🍽️' },
      { name: 'Transportation', color: '#3B82F6', icon: '🚗' },
      { name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
      { name: 'Entertainment', color: '#F59E0B', icon: '🎬' },
      { name: 'Bills & Utilities', color: '#10B981', icon: '💡' },
      { name: 'Healthcare', color: '#EC4899', icon: '🏥' },
      { name: 'Education', color: '#06B6D4', icon: '📚' },
      { name: 'Travel', color: '#84CC16', icon: '✈️' },
      { name: 'Other', color: '#6B7280', icon: '📦' },
    ];

    for (const categoryData of defaultCategories) {
      const existing = await this.categoriesRepository.findOne({
        where: { name: categoryData.name, userId: null },
      });

      if (!existing) {
        const category = this.categoriesRepository.create({
          ...categoryData,
          userId: null,
        });
        await this.categoriesRepository.save(category);
      }      
    }
  }

  async findAll(userId?: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: { isCustom: 'ASC', name: 'ASC' },
    });
  }

  async create(userId: string, categoryData: Category): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...categoryData,
      userId,
      isCustom: true,
    });
    return this.categoriesRepository.save(category);
  }

  async update(id: string, userId: string, updateData: any): Promise<Category> {
    await this.categoriesRepository.update({ id, userId }, updateData);
    return this.categoriesRepository.findOne({ where: { id, userId } });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.categoriesRepository.delete({ id, userId, isCustom: true });
  }
}
