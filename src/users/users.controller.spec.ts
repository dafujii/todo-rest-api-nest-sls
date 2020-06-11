import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/user.interface';
import * as bcrypt from 'bcrypt';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const salt = bcrypt.genSaltSync();

    const users: User[] = [
      {
        id: 1,
        username: 'alpha',
        password: bcrypt.hashSync('123456789', salt),
        createdAt: new Date('2020-06-01T01:23:34'),
        updatedAt: null,
        todos: [],
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'dummyfortest',
          signOptions: { expiresIn: '5m' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: (user: User): IUser => {
              users.push({
                ...user,
                id: users.length++,
                createdAt: new Date(),
                updatedAt: null,
              } as User);
              return user;
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('charlieが作成できること', async () => {
    const dto: CreateUserDto = {
      username: 'charlie',
      password: 'p@ssw0rd',
    };
    const user = await controller.create(dto);
    expect(user.username).toBe('charlie');
  });

  it('リクエストしたUser情報が閲覧できること', async () => {
    const result = await controller.getProfile({
      user: {
        foo: 'bar',
      },
    });

    expect(result).toEqual({
      foo: 'bar',
    });
  });
});
