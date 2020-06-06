/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/user.interface';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const salt = bcrypt.genSaltSync();

    const users: User[] = [
      {
        id: 1,
        username: 'alpha',
        password: bcrypt.hashSync('123456789', salt),
        created_at: new Date('2020-06-01T01:23:34'),
        updated_at: null,
        todos: [],
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: ({
              where: { username },
            }: {
              where: { username: string };
            }) => {
              return users.filter(user => user.username === username);
            },
            save: (user: User): IUser => {
              users.push({
                ...user,
                id: users.length++,
                created_at: new Date(),
                updated_at: null,
              } as User);
              return user;
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('alphaが取得できること', async () => {
    const user = await service.findOne('alpha');
    expect(user.username).toBe('alpha');
  });

  it('bravoが取得できないこと', async () => {
    const user = await service.findOne('bravo');
    expect(user).toBeUndefined();
  });

  it('charlieが作成できること', async () => {
    const user = await service.create('charlie', 'p@ssw0rd');
    expect(user.username).toBe('charlie');
  });
});
