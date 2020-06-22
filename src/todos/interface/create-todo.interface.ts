import { ToDoStatusType } from '../../entities/todo.entity';

export interface ICreateTodo {
  title: string;
  text: string;
  status: ToDoStatusType;
}
