import { ToDoStatusType } from '../../entities/todo.entity';

export class UpdateToDoDto {
  text: string;
  status: ToDoStatusType;
}
