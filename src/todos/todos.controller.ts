import {
  Controller,
  UseGuards,
  Get,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateToDoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  findAll(@Request() req) {
    return this.todosService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createToDoDto: CreateToDoDto) {
    return this.todosService.create(req.user.userId, createToDoDto);
  }
}
