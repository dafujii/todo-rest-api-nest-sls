import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export type ToDoStatusType = 'ToDo' | 'WIP' | 'Done';

@Entity()
export class ToDo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({
    type: 'varchar',
    length: 255,
    enum: ['ToDo', 'WIP', 'Done'],
    default: 'ToDo',
  })
  status: ToDoStatusType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => User,
    user => user.todos,
  )
  user: User;
}
