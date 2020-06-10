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
import {
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ToDo } from '../entities/todo.entity';
import {
  HttpStatusUnauthorizedDoc,
  HttpStatusNotFoundDoc,
  HttpStatusCreatedDoc,
} from '../openapi/HttpStatus.openapi';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiOkResponse({ type: ToDo, description: 'ToDo一覧', isArray: true })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  async findAll(@Request() req) {
    return await this.todosService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiOkResponse({ type: ToDo, description: 'ToDo' })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: HttpStatusNotFoundDoc,
    description: 'Not Found',
  })
  async findById(@Request() req, @Param('id') id: number) {
    const todo = await this.todosService.findById(id, req.user.userId);
    if (todo === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Get('search/:text')
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiOkResponse({
    type: ToDo,
    description:
      '検索結果一覧。件数が1つも無かった場合は空配列[]が返されます。',
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  async search(@Request() req, @Param('text') text: string) {
    return await this.todosService.search(req.user.userId, text);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiCreatedResponse({ type: HttpStatusCreatedDoc, description: 'Created' })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  async create(@Request() req, @Body() createToDoDto: CreateToDoDto) {
    return await this.todosService.create(req.user.userId, createToDoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiOkResponse({ type: ToDo, description: 'Updated' })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: HttpStatusNotFoundDoc,
    description: 'Not Found',
  })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateToDoDto: UpdateToDoDto,
  ) {
    const result = await this.todosService.update(
      id,
      req.user.userId,
      updateToDoDto,
    );
    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiHeader({ name: 'Authorization', description: 'Bearer {JWT}' })
  @ApiOkResponse({ description: 'Deleted' })
  @ApiUnauthorizedResponse({
    type: HttpStatusUnauthorizedDoc,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: HttpStatusNotFoundDoc,
    description: 'Not Found',
  })
  async delete(@Request() req, @Param('id') id: number) {
    const result = await this.todosService.delete(id, req.user.userId);
    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
