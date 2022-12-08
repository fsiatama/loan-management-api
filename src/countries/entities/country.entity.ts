import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('pais')
export class Country {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'pais_id' })
  id: number;
  @Column({ type: 'varchar', length: 60, name: 'pais_nombre' })
  name: string;
  @Column({ type: 'bool', name: 'pais_enmultipais' })
  isActive: boolean;
}
