import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column()
  isCredit: boolean;

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

  @Exclude()
  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions: Transaction[];
}
