import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';
import { Repository } from 'typeorm';

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
}
