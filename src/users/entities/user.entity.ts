import { PrimaryGeneratedColumn, Column, Entity, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'bool', name: 'is_root' })
  isRoot: boolean;

  @Column({ type: 'bool', name: 'is_active' })
  isActive: boolean;
}
