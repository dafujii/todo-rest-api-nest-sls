/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ToDo } from '../entities/todo.entity';
import { Repository } from 'typeorm';

describe('Todos Controller', () => {
  let controller: TodosController;
  let repo: Repository<ToDo>;
  let todos: ToDo[];

  beforeEach(async () => {
    todos = [
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
    repo = module.get<Repository<ToDo>>(getRepositoryToken(ToDo));
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
    const result = await controller.delete({ user: { userId: 1 } }, 1);
    expect(result).toBeUndefined();
  });

  it('id:10のToDoを試みてNotFound例外が発生すること', async () => {
    expect(async () => {
      await controller.delete({ user: { userId: 1 } }, 10);
    }).rejects.toThrow(/Not Found/);
  });

  it('id:1のToDoが取得できること', async () => {
    const result = await controller.findById({ user: { userId: 1 } }, 1);
    expect(result.id).toBe(1);
    expect(result.text).toBe('単体テスト書く');
  });

  it('id:10のToDoが取得できないこと', async () => {
    expect(async () => {
      await controller.findById(10, 1);
    }).rejects.toThrow(/Not Found/);
  });

  it('id:2のToDoが更新できること', async () => {
    const result = await controller.update({ user: { userId: 2 } }, 2, {
      text: '更新ToDo',
      status: 'Done',
    });
    expect(result.user_id).toBe(2);
    expect(result.text).toBe('更新ToDo');
    expect(result.status).toBe('Done');
  });

  it('id:20のToDo更新でNot Foundが返ってくること', async () => {
    expect(async () => {
      await controller.update(20, 1, {
        text: '更新ToDo',
        status: 'Done',
      });
    }).rejects.toThrow(/Not Found/);
  });

  it('user_id:2で「単体」を検索し1件取得できること', async () => {
    jest
      .spyOn(repo, 'find')
      .mockResolvedValueOnce(
        todos.filter(todo => todo.user_id === 2 && todo.text.includes('単体')),
      );

    const result = await controller.search({ user: { userId: 2 } }, '単体');
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('コントローラの単体テスト書く');
  });

  it('user_id:4で「テスト」を検索し0件取得できること', async () => {
    jest
      .spyOn(repo, 'find')
      .mockResolvedValueOnce(
        todos.filter(
          todo => todo.user_id === 4 && todo.text.includes('テスト'),
        ),
      );

    const result = await controller.search({ user: { userId: 4 } }, 'テスト');
    expect(result.length).toBe(0);
  });
});
