import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'dummyfortest',
          signOptions: { expiresIn: '5m' },
        }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('alpha/123456789 でユーザの検証に成功すること', async () => {
    const result = await service.validateUser('alpha', '123456789');
    expect(result).toEqual({
      userId: 1,
      username: 'alpha',
    });
  });

  it('bravo/123456789 でユーザの検証に失敗すること', async () => {
    const result = await service.validateUser('bravo', '123456789');
    expect(result).toBeNull();
  });
});
