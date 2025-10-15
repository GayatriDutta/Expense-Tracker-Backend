import { Expense } from "src/expenses/expense.entity";
import { User } from "src/users/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  icon: string;

  @Column({ default: false })
  isCustom: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}