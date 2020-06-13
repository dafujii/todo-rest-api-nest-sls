import { ToDoStatusType } from '../../entities/todo.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateToDoDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ name: 'status', enum: ['ToDo', 'WIP', 'Done'] })
  status: ToDoStatusType;
}
