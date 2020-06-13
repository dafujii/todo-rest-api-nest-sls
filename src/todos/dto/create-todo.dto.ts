import { ToDoStatusType } from '../../entities/todo.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToDoDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ enum: ['ToDo', 'WIP', 'Done'] })
  status: ToDoStatusType;
}
