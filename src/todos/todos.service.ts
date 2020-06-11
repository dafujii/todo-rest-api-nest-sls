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
        userId: userId,
      },
    });
  }

  async findById(id: number, userId: number) {
    return this.todoRepository.findOne(id, { where: { userId: userId } });
  }

  async search(userId: number, searchText: string) {
    return this.todoRepository.find({
      where: {
        userId: userId,
        text: Like(`%${searchText}%`),
      },
    });
  }

  async create(userId: number, createToDoDto: CreateToDoDto) {
    const todo = new ToDo();
    todo.text = createToDoDto.text;
    todo.status = createToDoDto.status;
    todo.userId = userId;
    return this.todoRepository.save(todo);
  }

  async update(id: number, userId: number, updateToDoDto: UpdateToDoDto) {
    const todo = await this.findById(id, userId);
    if (todo === undefined) {
      return undefined;
    }
    todo.text = updateToDoDto.text;
    todo.status = updateToDoDto.status;
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
