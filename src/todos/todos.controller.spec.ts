/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';

describe('Todos Controller', () => {
  let controller: TodosController;

  beforeEach(async () => {
    let todos: ToDo[] = [
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
            findOne: (id: number) => {
              return todos.find(todo => todo.id === id);
            },
            save: (todo: ToDo) => {
              const newItem = {
                ...todo,
                id: todos.length + 1,
                created_at: new Date(),
                updated_at: new Date(),
              };
              todos.push(newItem);
              return newItem;
            },
            remove: (todo: ToDo) => {
              todos = todos.filter(item => item.id !== todo.id);
              return todo;
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
    const result = await controller.findAll({ user: { userId: 2 } });
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

  it('user_id:1のToDoが登録できること', async () => {
    const result = await controller.create(
      { user: { userId: 1 } },
      {
        text: '新規ToDo',
        status: 'WIP',
      },
    );
    expect(result.id).toBe(3);
    expect(result.user_id).toBe(1);
    expect(result.text).toBe('新規ToDo');
    expect(result.status).toBe('WIP');
  });

  it('id:1のToDoが削除できること', async () => {
    const result = await controller.delete(1);
    expect(result).toBeUndefined();
  });

  it('id:10のToDoを試みてNotFound例外が発生すること', async () => {
    expect(async () => {
      await controller.delete(10);
    }).rejects.toThrow(/Not Found/);
  });
});
