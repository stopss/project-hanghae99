import { RoomsService } from './../../rooms/services/rooms.service';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CurrentUserEntity } from '../models/current.users.entity';

@Injectable()
export class CurrentUsersService {
  constructor(
    @Inject('CURRENT_REPOSITORY')
    private readonly currentUsersRepository: Repository<CurrentUserEntity>,
  ) {}

  async readyStateUpdate(userId: number, roomId: number) {
    const user = new CurrentUserEntity();
    const userReadyState = await this.currentUsersRepository.findOne({
      where: { userId },
    });
    if (userReadyState.readyState === true) {
      user.readyState = false;
      await this.currentUsersRepository.update(
        { userId },
        { readyState: false },
      );
      const users = await this.currentUsersRepository.find({
        where: { roomId },
      });
      return users;
    } else {
      user.readyState = true;
      const payload = {
        id: userReadyState.id,
        userId: userReadyState.userId,
        roomId: userReadyState.roomId,
        episodeId: userReadyState.episodeId,
        readyState: true,
        hintReady: false,
      };
      await this.currentUsersRepository.update({ userId }, payload);
      const users = await this.currentUsersRepository.find({
        where: { roomId },
      });
      return users;
    }
  }

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

  async currentUser(roomId: number) {
    const users = await this.currentUsersRepository.find({
      relations: { room: true },
      where: { roomId: roomId },
    });
    return users;
  }

  async currentUsers(roomId: number) {
    const users = await this.currentUsersRepository.find({ where: { roomId } });
    return users;
  }

  async userJoinRoom(userId: number, roomId: number) {
    const newJoiner = new CurrentUserEntity();
    newJoiner.roomId = roomId;
    newJoiner.userId = userId;
    const result = await this.currentUsersRepository.save(newJoiner);
    return result;
  }

  async roleRegister(roomId: number, room: Array<number>) {
    const users = await this.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < room.length; i++) {
      const payload = {
        userId: users[i].userId,
        roomId: users[i].roomId,
        episodeId: room[i],
        imageUrlId: room[i],
        readyState: true,
      };
      result.push(
        await this.currentUsersRepository.update(
          { userId: users[i].userId },
          payload,
        ),
      );
    }
    return result;
  }

  async hint(userId: number) {
    const updated = await this.currentUsersRepository.update(
      { userId },
      { hintReady: true },
    );
    return updated;
  }

  async hintRegister(userId: number, imageId: string) {
    const user = await this.currentUsersRepository.findOne({
      where: { userId },
    });
    const hintLists: string =
      user.hintLists === null ? `${imageId}` : user.hintLists + `,${imageId}`;
    return await this.currentUsersRepository.update({ userId }, { hintLists });
  }

  async exitRoom(userId: number) {
    const user = new CurrentUserEntity();
    // user.userId = userId;
    const result = this.currentUsersRepository.delete({ userId: userId });
    return result;
  }

  async vote(votedUserId: number) {
    const votedUser = await this.currentUsersRepository.findOne({
      where: { userId: votedUserId },
    });

    const voteCount = votedUser.vote + 1;
    return await this.currentUsersRepository.update(
      { userId: votedUserId },
      { vote: voteCount },
    );
  }
}
