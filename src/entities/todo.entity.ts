import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type ToDoStatusType = 'ToDo' | 'WIP' | 'Done';

@Entity('todos')
export class ToDo {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty()
  userId: number;

  @Column({ type: 'text' })
  @ApiProperty()
  text: string;

  @Column({
    type: 'varchar',
    length: 255,
    enum: ['ToDo', 'WIP', 'Done'],
    default: 'ToDo',
  })
  @ApiProperty()
  status: ToDoStatusType;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    user => user.todos,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
