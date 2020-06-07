import { ToDoStatusType } from '../../entities/todo.entity';

export class CreateToDoDto {
  text: string;
  status: ToDoStatusType;
}
