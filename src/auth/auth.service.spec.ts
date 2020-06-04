/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const users: User[] = [
      {
        id: 1,
        username: 'alpha',
        password: '123456789',
        created_at: new Date('2020-06-01T01:23:34'),
        updated_at: null,
      },
      {
        id: 2,
        username: 'bravo',
        password: 'password',
        created_at: new Date('2020-06-01T01:23:34'),
        updated_at: null,
      },
      {
        id: 3,
        username: 'charlie',
        password: 'p@ssw0rd',
        created_at: new Date('2020-06-01T01:23:34'),
        updated_at: null,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'dummyfortest',
          signOptions: { expiresIn: '5m' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: ({
              where: { username },
            }: {
              where: { username: string };
            }) => {
              return [users.find(user => user.username === username)];
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('alpha/123456789 でユーザの検証に成功すること', async () => {
    const result = await service.validateUser('alpha', '123456789');
    expect(result).toEqual({
      id: 1,
      username: 'alpha',
      created_at: new Date('2020-06-01T01:23:34'),
      updated_at: null,
    });
  });

  it('bravo/123456789 でユーザの検証に失敗すること', async () => {
    const result = await service.validateUser('bravo', '123456789');
    expect(result).toBeUndefined();
  });
});
