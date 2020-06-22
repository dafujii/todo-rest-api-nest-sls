import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';
import { Repository, Like } from 'typeorm';
import { ICreateTodo } from './interface/create-todo.interface';
import { IUpdateTodo } from './interface/update-todo.interface';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(ToDo)
    private readonly todoRepository: Repository<ToDo>,
  ) {}

  async findAllByUser(userId: number) {
    return this.todoRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async findById(id: number, userId: number) {
    return this.todoRepository.findOne(id, { where: { userId: userId } });
  }

  async search(userId: number, searchText: string) {
    return this.todoRepository.find({
      where: [
        { userId: userId, title: Like(`%${searchText}%`) },
        { userId: userId, text: Like(`%${searchText}%`) },
      ],
    });
  }

  async create(userId: number, createTodo: ICreateTodo) {
    const todo = new ToDo();
    todo.title = createTodo.title;
    todo.text = createTodo.text;
    todo.status = createTodo.status;
    todo.userId = userId;
    return this.todoRepository.save(todo);
  }

  async update(id: number, userId: number, updateTodo: IUpdateTodo) {
    const todo = await this.findById(id, userId);
    if (todo === undefined) {
      return undefined;
    }
    todo.title = updateTodo.title;
    todo.text = updateTodo.text;
    todo.status = updateTodo.status;
    return this.todoRepository.save(todo);
  }

  async delete(id: number, userId: number) {
    const todo = await this.findById(id, userId);
    if (todo === undefined) {
      return undefined;
    }
    return this.todoRepository.remove(todo);
  }
}
