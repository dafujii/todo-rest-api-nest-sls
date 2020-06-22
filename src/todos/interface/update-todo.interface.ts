import { ToDoStatusType } from '../../entities/todo.entity';

export interface IUpdateTodo {
  title: string;
  text: string;
  status: ToDoStatusType;
}
