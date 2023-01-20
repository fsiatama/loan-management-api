import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  amount: number;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'create_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'update_at',
  })
  updateAt: Date;

  @OneToOne(() => Loan, (loan) => loan.balance)
  loan: Loan;
}
