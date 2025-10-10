import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  amount: number;

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
