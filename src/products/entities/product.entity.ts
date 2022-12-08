import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('producto')
export class Product {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'producto_id' })
  id: number;
  @Column({ type: 'varchar', length: 60, name: 'producto_nombre' })
  name: string;
  @Column({ type: 'tinyint', name: 'producto_vduracion' })
  hasDuration: number;
  @Column({ type: 'tinyint', name: 'producto_vfdesactivacion' })
  hasDeactivateDate: number;
  @Column({ type: 'tinyint', name: 'producto_vintercambio' })
  hasTrades: number;
  @Column({ type: 'tinyint', name: 'producto_vpais' })
  hasCountries: number;
  @Column({ type: 'tinyint', name: 'producto_vpuertos' })
  hasPorts: number;
  @Column({ type: 'tinyint', name: 'producto_activo' })
  isActive: number;
}
