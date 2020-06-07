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
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateToDoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async findAll(@Request() req) {
    return await this.todosService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createToDoDto: CreateToDoDto) {
    return await this.todosService.create(req.user.userId, createToDoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id) {
    const result = await this.todosService.delete(id);
    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
