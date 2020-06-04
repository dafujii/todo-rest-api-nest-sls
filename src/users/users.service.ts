import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from './interface/user.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly users: IUser[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
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

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.find({
      where: {
        username: username,
      },
      take: 1,
    });

    if (user.length === 1) {
      return user[0];
    }

    return undefined;
  }
}
