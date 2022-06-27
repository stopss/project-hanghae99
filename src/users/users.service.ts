import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
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

  async findOne(nickname: string): Promise<User | undefined> {
    return this.users.find((user) => user.nickname === nickname);
  }
}
