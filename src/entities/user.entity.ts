import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IUser } from '../users/interface/user.interface';
import { ToDo } from './todo.entity';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  username: string;

  @Column({ length: 512 })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ToDo,
    todo => todo.user_id,
  )
  todos: ToDo[];
}
