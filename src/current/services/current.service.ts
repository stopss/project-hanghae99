import { Inject, Injectable } from '@nestjs/common';
import { Entity, Repository } from 'typeorm';
import { CurrentUserEntity } from '../current.users.entity';

@Injectable()
export class CurrentUsersService {
  constructor(
    @Inject('CURRENT_REPOSITORY')
    private readonly currentUsersRepository: Repository<CurrentUserEntity>,
  ) {}

  async getLog(userId: number) {
    const users = await this.currentUsersRepository.find({
      relations: {
        user: true,
        room: true,
        episode: true,
      },
    });
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.id !== userId) {
        delete users[i];
      }
      delete users[i].user.password;
    }
    return users;
  }

  async userJoinRoom(userId: number, roomId: number) {
    const newJoiner = new CurrentUserEntity();
    newJoiner.roomId = roomId;
    newJoiner.userId = userId;
    const result = await this.currentUsersRepository.save(newJoiner);
    return result;
  }

  async exitRoom(userId: number) {
    const user = new CurrentUserEntity();
    user.userId = userId;
    const result = await this.currentUsersRepository.delete(user);
    return result;
  }
}
