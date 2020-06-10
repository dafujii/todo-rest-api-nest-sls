import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type ToDoStatusType = 'ToDo' | 'WIP' | 'Done';

@Entity()
export class ToDo {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  user_id: number;

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

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;

  @ManyToOne(
    () => User,
    user => user.todos,
  )
  user: User;
}
