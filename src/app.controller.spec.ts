/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController', () => {
  let appController: AppController;

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

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'dummyfortest',
          signOptions: { expiresIn: '5m' },
        }),
      ],
      controllers: [AppController],
      providers: [
        AppService,
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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('3:charlie でログインに成功し、トークンが返却されること', async () => {
      const token = await appController.login({
        user: {
          id: 3,
          username: 'charlie',
        },
      });

      expect(token.access_token).toBeDefined();
    });
  });

  it('リクエストしたUser情報が閲覧できること', async () => {
    const result = await appController.getProfile({
      user: {
        foo: 'bar',
      },
    });

    expect(result).toEqual({
      foo: 'bar',
    });
  });
});
