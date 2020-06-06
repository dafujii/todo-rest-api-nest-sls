import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { ToDo } from '../entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo])],
  providers: [TodosService],
  exports: [TodosService, TypeOrmModule],
  controllers: [TodosController],
})
export class TodosModule {}
