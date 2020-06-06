/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { ToDo } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const todos: ToDo[] = [
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
});
