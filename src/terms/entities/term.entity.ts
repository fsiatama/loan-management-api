import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Loan } from '../../loans/entities/loan.entity';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int2' })
  periods: number;

  @Column({ type: 'numeric', name: 'annual_interest_rate' })
  annualInterestRate: number;

  @Column({ type: 'numeric', name: 'late_payment_fee' })
  latePaymentFee: number;

  @Column({ type: 'date', name: 'begin_to_apply_date' })
  beginToApplyDate: string;

  @Column({ type: 'int2', name: 'cut_off_day' })
  cutOffDay: number;

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

  @ManyToOne(() => Loan, (loan) => loan.terms)
  loan: Loan;
}
