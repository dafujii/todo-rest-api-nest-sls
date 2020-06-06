import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
