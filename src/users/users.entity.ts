import { Budget } from 'src/budget/budget.entity';
import { Expense } from 'src/expenses/expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

   @OneToMany(() => Budget, budget => budget.user)
  budgets: Budget[];

}
