import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { Country } from '../../countries/entities/country.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'usuario_id' })
  id: number;

  @Column({ type: 'int', name: 'usuario_idioma_id' })
  langId: number;

  @ManyToOne((): typeof Country => Country, { nullable: false })
  @JoinColumn({ name: 'usuario_pais_id' })
  country: Country;

  @ManyToOne((): typeof Company => Company, { nullable: false })
  @JoinColumn({ name: 'usuario_empresa_id' })
  company: Company;

  @Column({ type: 'varchar', length: 20, name: 'usuario_ciudad' })
  city: string;

  @Column({ type: 'varchar', length: 20, name: 'usuario_telefono' })
  phone: string;

  @Column({ type: 'varchar', length: 60, name: 'usuario_nombres' })
  name: string;

  @Column({ type: 'varchar', length: 60, name: 'usuario_apellidos' })
  lastName: string;

  @Index({ unique: true })
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

  @Column({ type: 'bool', name: 'usuario_mfa' })
  useMfa: boolean;
}
