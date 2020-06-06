/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';

describe('Todos Controller', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const todos: ToDo[] = [
      {
        id: 1,
        user_id: 1,
        text: '単体テスト書く',
        status: 'ToDo',
        created_at: new Date('2020-05-06T20:00:00'),
        updated_at: new Date('2020-05-06T20:00:00'),
        user: null,
      },
      {
        id: 2,
        user_id: 2,
        text: 'コントローラの単体テスト書く',
        status: 'ToDo',
        created_at: new Date('2020-05-06T20:40:00'),
        updated_at: new Date('2020-05-06T20:40:00'),
        user: null,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(ToDo),
          useValue: {
            find: ({ where: { user_id } }: { where: { user_id: number } }) => {
              return todos.filter(todo => todo.user_id === user_id);
            },
          },
        },
      ],
      controllers: [TodosController],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('user_id:2の一覧が取得できること', async () => {
    const result = await controller.findAll({ id: 2 });
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      id: 2,
      user_id: 2,
      text: 'コントローラの単体テスト書く',
      status: 'ToDo',
      created_at: new Date('2020-05-06T20:40:00'),
      updated_at: new Date('2020-05-06T20:40:00'),
      user: null,
    } as ToDo);
  });
});
