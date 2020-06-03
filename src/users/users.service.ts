import { Injectable } from '@nestjs/common';
import { IUser } from './interface/user.interface';

@Injectable()
export class UsersService {
  private readonly users: IUser[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'alpha',
        password: '123456789',
      },
      {
        userId: 2,
        username: 'bravo',
        password: 'password',
      },
      {
        userId: 3,
        username: 'charlie',
        password: 'p@ssw0rd',
      },
    ];
  }

  // TODO: TypeORM
  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }
}
