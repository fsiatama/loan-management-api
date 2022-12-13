import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('accesoprod')
export class Suscription {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'accesoprod_id' })
  id: number;

  @Column({ type: 'bool', name: 'accesoprod_servimp' })
  hasImpo: boolean;

  @Column({ type: 'bool', name: 'accesoprod_servexp' })
  hasExpo: boolean;

  @Column({ type: 'bool', name: 'accesoprod_edit_rep' })
  canEditReports: boolean;

  @Column({ type: 'date', name: 'accesoprod_fechainicio' })
  initialDate: Date;

  @Column({ type: 'date', name: 'accesoprod_fdesactivacion' })
  finalDate: Date;

  @Column({ type: 'int', name: 'accesoprod_duracion' })
  months: Date;

  @Column({ type: 'varchar', length: 255, name: 'accesoprod_paises' })
  countries: string;

  @Column({ type: 'varchar', length: 255, name: 'accesoprod_puertos' })
  ports: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'accesoprod_usuario_id' })
  user: User;

  //@ManyToOne(() => Product, { nullable: false })
  //@JoinColumn({ name: 'accesoprod_producto_id' })
  //products: Product[];
}
