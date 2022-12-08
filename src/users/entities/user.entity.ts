import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'usuario_id' })
  id: number;
  @Column({ type: 'int', name: 'usuario_idioma_id' })
  langId: number;
  @Column({ type: 'int', name: 'usuario_pais_id' })
  countryId: number;
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
  @Column({ type: 'bool', name: 'usuario_email' })
  isRoot: boolean;
  @Column({ type: 'bool', name: 'usuario_email' })
  isActive: boolean;
  @Column({ type: 'bool', name: 'usuario_email' })
  canRenovate: boolean;
  @Column({ type: 'bool', name: 'usuario_email' })
  canDownload: boolean;
}
