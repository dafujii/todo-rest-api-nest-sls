import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { ToDo } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TodosService', () => {
  let service: TodosService;
  let repo: Repository<ToDo>;
  let todos: ToDo[];

  beforeEach(async () => {
    todos = [
      {
        id: 1,
        userId: 1,
        title: 'ToDo1',
        text: '単体テスト書く',
        status: 'WIP',
        createdAt: new Date('2020-05-06T20:00:00'),
        updatedAt: new Date('2020-05-06T20:00:00'),
        user: null,
      },
      {
        id: 2,
        userId: 1,
        title: 'ToDo2',
        text: 'E2Eテスト書く',
        status: 'ToDo',
        createdAt: new Date('2020-06-06T21:00:00'),
        updatedAt: new Date('2020-06-06T21:00:00'),
        user: null,
      },
      {
        id: 3,
        userId: 1,
        title: 'ToDo3',
        text: '納品',
        status: 'ToDo',
        createdAt: new Date('2020-06-07T20:00:00'),
        updatedAt: new Date('2020-06-07T20:00:00'),
        user: null,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(ToDo),
          useValue: {
            find: ({ where: { userId } }: { where: { userId: number } }) => {
              return todos.filter(todo => todo.userId === userId);
            },
            findOne: (id: number) => {
              return todos.find(todo => todo.id === id);
            },
            save: (todo: ToDo) => {
              const newItem = {
                ...todo,
                id: todos.length + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
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
    repo = module.get<Repository<ToDo>>(getRepositoryToken(ToDo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userId:1の一覧が取得できること', async () => {
    const result = await service.findAllByUser(1);
    expect(result.length).toBe(3);
    expect(result[0].text).toBe('単体テスト書く');
    expect(result[1].text).toBe('E2Eテスト書く');
    expect(result[2].text).toBe('納品');
  });

  it('userId:2の一覧が空で取得できること', async () => {
    const result = await service.findAllByUser(2);
    expect(result.length).toBe(0);
  });

  it('userId:1のToDoが登録できること', async () => {
    const result = await service.create(1, {
      title: 'しんきToDo',
      text: '新規ToDo',
      status: 'ToDo',
    });
    expect(result.title).toBe('しんきToDo');
    expect(result.text).toBe('新規ToDo');
  });

  it('id:1のToDoが削除できること', async () => {
    const result = await service.delete(1, 1);
    expect(result.id).toBe(1);
  });

  it('id:4の削除でundefinedを返すこと', async () => {
    const result = await service.delete(4, 1);
    expect(result).toBeUndefined();
  });

  it('id:1のToDoが取得できること', async () => {
    const result = await service.findById(1, 1);
    expect(result.id).toBe(1);
    expect(result.text).toBe('単体テスト書く');
  });

  it('id:1のToDoが更新できること', async () => {
    const result = await service.update(1, 1, {
      text: 'ToDo更新',
      status: 'WIP',
    });
    expect(result.text).toBe('ToDo更新');
    expect(result.status).toBe('WIP');
  });

  it('userId:1で「テスト」で検索し2件取得できること', async () => {
    jest
      .spyOn(repo, 'find')
      .mockResolvedValueOnce(
        todos.filter(
          todo =>
            todo.userId === 1 &&
            (todo.text.includes('テスト') || todo.title.includes('テスト')),
        ),
      );

    const result = await service.search(1, 'テスト');
    expect(result.length).toBe(2);
    expect(result[0].text).toBe('単体テスト書く');
    expect(result[1].text).toBe('E2Eテスト書く');
  });

  it('userId:1で「3」で検索し1件取得できること', async () => {
    jest
      .spyOn(repo, 'find')
      .mockResolvedValueOnce(
        todos.filter(
          todo =>
            todo.userId === 1 &&
            (todo.text.includes('3') || todo.title.includes('3')),
        ),
      );

    const result = await service.search(1, '3');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('ToDo3');
  });
});
