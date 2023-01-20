import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';
import { TransactionType } from '../../transaction-types/entities/transaction-type.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'numeric', name: 'applied_to_interest' })
  appliedToInterest: number;

  @Column({ type: 'numeric', name: 'applied_to_principal' })
  appliedToPrincipal: number;

  @Column({ type: 'numeric', name: 'ending_balance' })
  endingBalance: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

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

  @ManyToOne(() => Loan, (loan) => loan.transactions)
  loan: Loan;

  @ManyToOne(() => TransactionType, (type) => type.transactions)
  transactionType: TransactionType;
}
