/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateToDoDto } from './dto/create-todo.dto';

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

  async create(userId: number, createToDoDto: CreateToDoDto) {
    const todo = new ToDo();
    todo.text = createToDoDto.text;
    todo.status = createToDoDto.status;
    todo.user_id = userId;
    return this.todoRepository.save(todo);
  }
}
