import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('producto')
export class Product {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'producto_id' })
  id: number;
  @Column({ type: 'varchar', length: 60, name: 'producto_nombre' })
  name: string;
  @Column({ type: 'bool', name: 'producto_vduracion' })
  hasDuration: boolean;
  @Column({ type: 'bool', name: 'producto_vfdesactivacion' })
  hasDeactivateDate: boolean;
  @Column({ type: 'bool', name: 'producto_vintercambio' })
  hasTrades: boolean;
  @Column({ type: 'bool', name: 'producto_vpais' })
  hasCountries: boolean;
  @Column({ type: 'bool', name: 'producto_vpuertos' })
  hasPorts: boolean;
  @Column({ type: 'bool', name: 'producto_activo' })
  isActive: boolean;
}
