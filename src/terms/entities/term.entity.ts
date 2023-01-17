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

  @Column()
  periods: number;

  @Column({ name: 'annual_interest_rate' })
  annualInterestRate: number;

  @Column({ type: 'date', name: 'begin_to_apply_date' })
  beginToApplyDate: string;

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
