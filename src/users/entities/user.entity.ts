import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Country } from '../../countries/entities/country.entity';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'usuario_id' })
  id: number;

  @Column({ type: 'int', name: 'usuario_idioma_id' })
  langId: number;

  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'usuario_pais_id' })
  country: Country;

  @Column({ type: 'int', name: 'usuario_empresa_id' })
  companyId: number;

  @Column({ type: 'varchar', length: 20, name: 'usuario_telefono' })
  phone: string;

  @Column({ type: 'varchar', length: 60, name: 'usuario_nombres' })
  name: string;

  @Column({ type: 'varchar', length: 60, name: 'usuario_apellidos' })
  lastName: string;

  @Column({ type: 'varchar', length: 15, name: 'usuario_login' })
  username: string;

  @Column({ type: 'varchar', length: 50, name: 'usuario_password' })
  password: string;

  @Column({ type: 'varchar', length: 100, name: 'usuario_email' })
  email: string;

  @Column({ type: 'bool', name: 'usuario_isroot' })
  isRoot: boolean;

  @Column({ type: 'bool', name: 'usuario_activo' })
  isActive: boolean;

  @Column({ type: 'bool', name: 'usuario_btn_ren' })
  canRenovate: boolean;

  @Column({ type: 'bool', name: 'usuario_download' })
  canDownload: boolean;
}
