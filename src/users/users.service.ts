import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
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

  async create(username: string, rawPassword: string): Promise<IUser> {
    const user = new User();
    user.username = username;
    user.password = this.getPasswordHash(rawPassword);

    const result = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = result;
    return newUser;
  }

  private getPasswordHash(rawPassword: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, salt);
  }
}
