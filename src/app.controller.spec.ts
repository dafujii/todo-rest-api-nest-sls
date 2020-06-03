import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'dummyfortest',
          signOptions: { expiresIn: '5m' },
        }),
      ],
      controllers: [AppController],
      providers: [AppService, AuthService, UsersService],
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
          userId: 3,
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
