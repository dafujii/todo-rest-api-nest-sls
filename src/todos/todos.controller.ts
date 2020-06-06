import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  findAll(@Request() req) {
    return this.todosService.findAllByUser(req.user.userId);
  }
}
