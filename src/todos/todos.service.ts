/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';
import { Repository, Like } from 'typeorm';
import { CreateToDoDto } from './dto/create-todo.dto';
import { UpdateToDoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(ToDo)
    private readonly todoRepository: Repository<ToDo>,
  ) {}

  async findAllByUser(userId: number) {
    return this.todoRepository.find({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        user_id: userId,
      },
    });
  }

  async findById(id: number) {
    return this.todoRepository.findOne(id);
  }

  async search(userId: number, searchText: string) {
    return this.todoRepository.find({
      where: {
        user_id: userId,
        text: Like(`%${searchText}%`),
      },
    });
  }

  async create(userId: number, createToDoDto: CreateToDoDto) {
    const todo = new ToDo();
    todo.text = createToDoDto.text;
    todo.status = createToDoDto.status;
    todo.user_id = userId;
    return this.todoRepository.save(todo);
  }

  async update(id: number, updateToDoDto: UpdateToDoDto) {
    const todo = await this.todoRepository.findOne(id);
    if (todo === undefined) {
      return undefined;
    }
    todo.text = updateToDoDto.text;
    todo.status = updateToDoDto.status;
    return this.todoRepository.save(todo);
  }

  async delete(id: number) {
    const todo = await this.todoRepository.findOne(id);
    if (todo === undefined) {
      return undefined;
    }
    return this.todoRepository.remove(todo);
  }
}
