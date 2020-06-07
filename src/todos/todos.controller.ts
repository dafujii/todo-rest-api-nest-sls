import {
  Controller,
  UseGuards,
  Get,
  Request,
  Post,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateToDoDto } from './dto/create-todo.dto';
import { UpdateToDoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async findAll(@Request() req) {
    return await this.todosService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number) {
    const todo = await this.todosService.findById(id);
    if (todo === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Get('search/:text')
  async search(@Request() req, @Param('text') text: string) {
    const todos = await this.todosService.search(req.user.userId, text);
    return todos;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createToDoDto: CreateToDoDto) {
    return await this.todosService.create(req.user.userId, createToDoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateToDoDto: UpdateToDoDto) {
    const result = await this.todosService.update(id, updateToDoDto);
    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.todosService.delete(id);
    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
