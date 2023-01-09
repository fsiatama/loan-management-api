import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('empresa')
export class Company {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'empresa_id' })
  id: number;

  @Column({ type: 'varchar', length: 16, name: 'empresa_nit' })
  nit: string;

  @Column({ type: 'varchar', length: 3, name: 'empresa_digcheq' })
  digcheq: string;

  @Column({ type: 'varchar', length: 60, name: 'empresa_razon' })
  name: string;

  @Column({ type: 'varchar', length: 200, name: 'empresa_ip' })
  allowedIps: string;

  @Column({ type: 'int', name: 'empresa_usuario_tpl_id' })
  userTemplateId: number;

  @ManyToOne((): typeof User => User, { nullable: true })
  @JoinColumn({ name: 'empresa_usuario_tpl_id' })
  userTemplate: User;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
