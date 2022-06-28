import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/users.entity';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private readonly users = [
    {
      userId: 1,
      nickname: 'jin',
      password: '123',
    },
    {
      userId: 2,
      nickname: 'nwnp',
      password: '123',
    },
  ];

  async findOne(nickname: string) {
    return this.users.find((user) => user.nickname === nickname);
  }

  async findAll() {
    return this.usersRepository.find();
  }
}
