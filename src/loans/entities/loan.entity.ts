import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Client } from '../../clients/entities/client.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Term } from '../../terms/entities/term.entity';
import { Balance } from '../../balances/entities/balance.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  ammount: number;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

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

  @ManyToOne(() => Client, (client) => client.loans)
  client: Client;

  @Exclude()
  @OneToMany(() => Payment, (payment) => payment.loan)
  payments: Payment[];

  @Exclude()
  @OneToMany(() => Term, (term) => term.loan)
  terms: Term[];

  @OneToOne(() => Balance, (balance) => balance.loan)
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;
}
