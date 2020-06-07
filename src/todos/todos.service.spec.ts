/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { ToDo } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    let todos: ToDo[] = [
      {
        id: 1,
        user_id: 1,
        text: '単体テスト書く',
        status: 'WIP',
        created_at: new Date('2020-05-06T20:00:00'),
        updated_at: new Date('2020-05-06T20:00:00'),
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
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userId:1の一覧が取得できること', async () => {
    const result = await service.findAllByUser(1);
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('単体テスト書く');
  });

  it('userId:2の一覧が空で取得できること', async () => {
    const result = await service.findAllByUser(2);
    expect(result.length).toBe(0);
  });

  it('userId:1のToDoが登録できること', async () => {
    const result = await service.create(1, {
      text: '新規ToDo',
      status: 'ToDo',
    });
    expect(result.text).toBe('新規ToDo');
  });

  it('id:1のToDoが削除できること', async () => {
    const result = await service.delete(1);
    expect(result.id).toBe(1);
  });

  it('id:2の削除でundefinedを返すこと', async () => {
    const result = await service.delete(2);
    expect(result).toBeUndefined();
  });

  it('id:1のToDoが取得できること', async () => {
    const result = await service.findById(1);
    expect(result.id).toBe(1);
    expect(result.text).toBe('単体テスト書く');
  });

  it('id:1のToDoが更新できること', async () => {
    const result = await service.update(1, {
      text: 'ToDo更新',
      status: 'WIP',
    });
    expect(result.text).toBe('ToDo更新');
    expect(result.status).toBe('WIP');
  });
});
