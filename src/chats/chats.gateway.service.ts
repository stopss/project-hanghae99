import { UsersService } from './../users/services/users.service';
import { RoomsService } from './../rooms/services/rooms.service';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { JoinRoomDto } from './dto/join.room.dto';
import { WsException } from '@nestjs/websockets';
import { CurrentUsersService } from 'src/current/services/current.service';
import { ExitRoomDto } from './dto/exit.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { CreateRoomDto } from './dto/create.room.dto';
import { PeerRoomDto } from './dto/peer.room.dto';
import { HintDto } from './dto/hint.dto';
import { EpisodeService } from 'src/episode/episode.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    private readonly currentUsersService: CurrentUsersService,
    private readonly episodeService: EpisodeService,
  ) {}
  private logger = new Logger('CHATTING');

  connected(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }

  disconnected(socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  async getRoomInfo(roomId: number, socket: Socket) {
    const room = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('get_room', { roomInfo: room });
  }

  async update(data: UpdateRoomDto, socket: Socket) {
    const {
      title,
      password,
      hintTime,
      reasoningTime,
      isRandom,
      roomId,
      master,
    } = data;
    const room = await this.roomsService.findRoomById(parseInt(roomId));
    const payload = {
      title,
      password,
      hintTime,
      reasoningTime,
      isRandom,
      master,
      count: room.count,
      roomUniqueId: room.roomUniqueId,
      roomState: room.roomState,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    const updatedRoom = await this.roomsService.updateRoom(
      parseInt(roomId),
      payload,
    );
    const result = await this.roomsService.findRoomById(parseInt(roomId));
    const currentUser = await this.currentUsersService.currentUsers(+roomId);
    let users = [];
    for (let i = 0; i < currentUser.length; i++) {
      await this.currentUsersService.readyStateInit(currentUser[i].userId);
      users.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      // users.push(await this.usersService.findUserById(currentUser[i].userId));
      // users[i].readyState = currentUser[i].readyState;
      users[i].readyState = false;
      delete users[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: result, currentUser: users });
    socket.emit('update_room', { roomInfo: result, currentUser: users });
  }

  async chats(chat: ChatDto, socket: Socket) {
    const { message, userId, roomId, at } = chat;
    const room = await this.roomsService.findRoomById(roomId);
    const user = await this.usersService.findUserById(userId);

    socket.to(room.roomUniqueId).emit('new_chat', { message, user, at });
    socket.emit('new_chat', { message, user, at });
  }

  async roomList(socket: Socket) {
    const roomList = await this.roomsService.getAllRoom();
    socket.emit('room_list', roomList);
  }

  async create(socket: Socket, data: CreateRoomDto) {
    const room = await this.roomsService.findRoomById(data.roomId);
    const currentUser = await this.currentUsersService.userJoinRoom(
      room.userId,
      data.roomId,
      data.streamId,
    );
    const user = await this.usersService
      .findUserById(currentUser.userId)
      .then((res) => console.log(res))
      .catch((err) => err);
    const current_user = await this.currentUsersService.currentUsers(
      data.roomId,
    );
    socket.join(data.roomUniqueId);
    socket.emit('new_chat', { message: '방을 생성합니다.', roomInfo: room });
    socket.emit('update_room', {
      roomInfo: room,
      currentUser: [{ ...user, ...currentUser }],
      user,
      current_user,
    });
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname, streamId } = data;
    const room = await this.roomsService.findRoomById(roomId);

    if (room.count === 5) throw new WsException('참가인원이 꽉 찼습니다.');
    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) + 1,
      roomUniqueId: room.roomUniqueId,
      roomState: room.roomState,
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    await this.roomsService.updateRoom(room.id, payload);
    await this.currentUsersService.userJoinRoom(userId, room.id, streamId);

    socket.join(room.roomUniqueId);
    socket.to(room.roomUniqueId).emit('new_chat', {
      message: `${nickname}님이 입장하셨습니다.`,
    });
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket.emit('update_room', { roomInfo: room, currentUser: result });
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: room, currentUser: result });
    // socket.to(room.roomUniqueId).emit('user_connected');
  }

  async peerJoin(socket: Socket, data: PeerRoomDto) {
    const { roomId, peerId } = data;
    const room = await this.roomsService.findRoomById(roomId);
    console.log('peerId: ', peerId);
    console.log(room.roomUniqueId);
    socket.join(room.roomUniqueId);
    // socket.broadcast.to(room.roomUniqueId).emit('user_connected', peerId);
  }

  async offer(socket: Socket, data) {
    const { offer, roomId } = data;
    const room = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('offer', offer);
  }

  async answer(socket: Socket, data) {
    const { answer, roomId } = data;
    const room = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('answer', answer);
  }

  async ice(socket: Socket, data) {
    const { ice, roomId } = data;
    console.log('ice', ice);
    const room = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('ice', ice);
  }

  async exit(socket: Socket, data: ExitRoomDto) {
    const { userId, roomId } = data;
    const currentUsers = await this.currentUsersService.currentUsers(roomId);
    const user = await this.usersService.findUserById(userId);
    const room = await this.roomsService.findRoomById(roomId);

    if (user.nickname === room.master) {
      if (+room.count === 1) {
        await this.currentUsersService.exitRoom(userId);
        await this.roomsService.deleteRoom(room.id);
        socket.emit('new_chat', { message: '방을 삭제합니다.' });
      } else {
        await this.currentUsersService.exitRoom(userId);
        const currentUser = await this.currentUsersService.currentUsers(roomId);
        if (currentUser.length === 0) {
          await this.roomsService.deleteRoom(room.id);
          return;
        }
        let result = [];
        for (let i = 0; i < currentUser.length; i++) {
          const user = await this.usersService.findUserById(
            currentUser[i].userId,
          );
          result.push({ ...user, ...currentUser[i] });
          result[i].readyState = currentUser[i].readyState;
          delete result[i].password;
        }
        const newMasterNo = Math.floor(Math.random() * result.length + 1);
        const payload = {
          title: room.title,
          password: room.password,
          hintTime: room.hintTime,
          reasoningTime: room.reasoningTime,
          isRandom: room.isRandom,
          count: parseInt(room.count) - 1,
          master: result[newMasterNo - 1].nickname,
          roomUniqueId: room.roomUniqueId,
          userId: result[newMasterNo - 1].userId,
          roomState: room.roomState,
          hintReady: room.hintReady,
        };
        await this.roomsService.updateRoom(roomId, payload);
        const resultRoom = await this.roomsService.findRoomById(roomId);
        socket.to(room.roomUniqueId).emit('update_room', {
          success: true,
          roomInfo: resultRoom,
          currentUser: result,
        });
      }
    } else {
      if (+room.count === 1) {
        await this.currentUsersService.exitRoom(userId);
        await this.roomsService.deleteRoom(room.id);
        socket.emit('new_chat', { message: '방을 삭제합니다.' });
      }
      const payload = {
        title: room.title,
        password: room.password,
        hintTime: room.hintTime,
        reasoningTime: room.reasoningTime,
        isRandom: room.isRandom,
        count: parseInt(room.count) - 1,
        master: room.master,
        roomUniqueId: room.roomUniqueId,
        userId: room.userId,
        roomState: room.roomState,
        hintReady: room.hintReady,
      };
      await this.roomsService.updateRoom(roomId, payload);
      await this.currentUsersService.exitRoom(userId);
      const currentUser = await this.currentUsersService.currentUsers(+roomId);
      let result = [];
      for (let i = 0; i < currentUser.length; i++) {
        result.push({
          ...(await this.usersService.findUserById(currentUser[i].userId)),
          ...currentUser[i],
        });
        result[i].readyState = currentUser[i].readyState;
        delete result[i].password;
      }
      const resultRoom = await this.roomsService.findRoomById(roomId);
      socket.to(room.roomUniqueId).emit('new_chat', {
        message: `${user.nickname}님이 퇴장했습니다.`,
      });
      socket.to(room.roomUniqueId).emit('update_room', {
        currentUser: result,
        roomInfo: resultRoom,
      });
    }
  }

  async ready(socket: Socket, userId: string, roomId: string) {
    const users = await this.currentUsersService.readyStateUpdate(
      +userId,
      +roomId,
    );
    const room = await this.roomsService.findRoomById(+roomId);
    let result = [];
    for (let i = 0; i < users.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(users[i].userId)),
        ...users[i],
      });
      result[i].readyState = users[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: room, currentUser: result });
    socket.emit('update_room', { roomInfo: room, currentUser: result });
  }

  async start(socket: Socket, userId: string, roomId: string) {
    const room = await this.roomsService.findRoomById(+roomId);
    let random = [];
    let i = 0;
    if (room.isRandom === true) {
      while (i < 6) {
        let n = Math.floor(Math.random() * 5) + 1;
        if (!random.find((e) => e === n)) {
          random.push(n);
          i++;
        }
      }
    }
    await this.currentUsersService.roleRegister(+roomId, random);
    const roomUpdatePayload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: room.count,
      roomUniqueId: room.roomUniqueId,
      roomState: 'hintReady',
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    await this.roomsService.updateRoom(+roomId, roomUpdatePayload);
    const currentUser = await this.currentUsersService.currentUsers(+roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    const roomInfo = await this.roomsService.findRoomById(+roomId);
    socket.to(room.roomUniqueId).emit('update_room', {
      success: true,
      roomInfo,
      currentUser: result,
    });
    socket.emit('update_room', {
      success: true,
      roomInfo,
      currentUser: result,
    });
  }

  async hintReady(socket: Socket, userId: number, roomId: number) {
    await this.currentUsersService.hint(userId);
    const room = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].hintReady = currentUser[i].hintReady;
      delete result[i].password;
    }
    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: room.count,
      roomUniqueId: room.roomUniqueId,
      roomState: room.roomState,
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady + 1,
    };
    await this.roomsService.updateRoom(roomId, payload);
    const resultRoom = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('update_room', {
      success: true,
      roomInfo: room,
      currentUser: result,
    });
    socket.emit('update_room', {
      success: true,
      roomInfo: resultRoom,
      currentUser: result,
    });
  }

  async hintRoleChoiceTime(socket: Socket, roomId: number) {
    const room = await this.roomsService.findRoomById(roomId);

    const payload = { ...room, roomState: 'roleChoice' };
    await this.roomsService.updateRoom(roomId, payload);
    const roomInfo = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo, currentUser: result });
    socket.emit('update_room', { roomInfo, currentUser: result });
  }

  async hintStart(socket: Socket, userId: number, roomId: number) {
    const room = await this.roomsService.findRoomById(roomId);
    // if (room.hintReady !== 2) {
    //   throw new WsException(
    //     '모든 유저가 준비완료가 되어야 시작할 수 있습니다.',
    //   );
    // }
    // TODO: 게임시작하면 GameLog에 게임 로그 기록

    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: room.count,
      roomUniqueId: room.roomUniqueId,
      roomState: 'hintTime',
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    await this.roomsService.updateRoom(roomId, payload);
    const roomInfo = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo, currentUser: result });
    socket.emit('update_room', { roomInfo, currentUser: result });
  }

  async hintRegister(
    socket: Socket,
    userId: number,
    roomId: number,
    imageId: string,
  ) {
    const room = await this.roomsService.findRoomById(roomId);
    const hintRegisterResult = await this.currentUsersService.hintRegister(
      userId,
      imageId,
    );
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }

    socket.emit('update_room', {
      roomInfo: room,
      hintLists: hintRegisterResult,
      currentUser: result,
    });
  }

  async reasoningTime(socket: Socket, roomId: number) {
    console.log('reasoning time', roomId);
    const room = await this.roomsService.findRoomById(roomId);
    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: room.count,
      roomUniqueId: room.roomUniqueId,
      roomState: 'reasoningTime',
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    await this.roomsService.updateRoom(roomId, payload);
    const roomInfo = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);

    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }

    console.log(roomInfo);

    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo, currentUser: result });
    socket.emit('update_room', { roomInfo, currentUser: result });
  }

  async hintInBoard(socket: Socket, imageInfo: HintDto, roomId: number) {
    const room = await this.roomsService.findRoomById(roomId);
    socket.to(room.roomUniqueId).emit('hint_board', imageInfo);
    socket.emit('hint_board', imageInfo);
  }

  async kickUser(
    socket: Socket,
    roomId: number,
    kickedUserId: number,
    masterUserId: number,
  ) {
    const room = await this.roomsService.findRoomById(roomId);
    const kickedUser = await this.usersService.findUserById(kickedUserId);
    if (room.userId !== masterUserId)
      return new WsException('방장만 강퇴시킬 수 있음');
    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: room.count - 1,
      roomUniqueId: room.roomUniqueId,
      roomState: room.roomState,
      master: room.master,
      userId: room.userId,
      hintReady: room.hintReady,
    };
    await this.roomsService.updateRoom(roomId, payload);
    await this.roomsService.banUsers(roomId, kickedUserId);
    await this.currentUsersService.kickUser(roomId, kickedUserId);
    const roomInfo = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);

    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }

    console.log('kick user', result);

    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo, currentUser: result });
    socket.emit('update_room', { roomInfo, currentUser: result });

    socket.to(room.roomUniqueId).emit('new_chat', {
      message: `${kickedUser.nickname}님이 강퇴당했습니다.`,
    });
    socket.emit('new_chat', {
      message: `${kickedUser.nickname}님이 강퇴당했습니다.`,
    });
  }

  async choiceRole(
    socket: Socket,
    roomId: number,
    selectedUserId: number,
    episodeId: number,
  ) {
    const episode = await this.episodeService.findEpisodeById(episodeId);
    if (!episode) return new WsException('존재하지 않는 역할입니다.');
    const isExistRole = await this.currentUsersService.findUserByEpisodeId(
      roomId,
      episodeId,
    );
    if (isExistRole === null) throw new WsException('이미 선택된 역할입니다.');
    await this.currentUsersService.choiceRole(
      roomId,
      selectedUserId,
      episode.id,
    );
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    const room = await this.roomsService.findRoomById(roomId);

    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push({
        ...(await this.usersService.findUserById(currentUser[i].userId)),
        ...currentUser[i],
      });
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket.emit('new_chat', { message: `${episode[0].role}을 선택했습니다.` });
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: room, currentUser: result });
    socket.emit('update_room', { roomInfo: room, currentUser: result });
  }

  async forceQuit(socket: Socket, roomId: number, exitedUserId: number) {
    const room = await this.roomsService.findRoomById(roomId);
    const user = await this.usersService.findUserById(exitedUserId);
    if (user.nickname !== room.master) {
      // 그냥 유저가 나갔을 때
      const payload = {
        title: room.title,
        password: room.password,
        hintTime: room.hintTime,
        reasoningTime: room.reasoningTime,
        isRandom: room.isRandom,
        count: room.count - 1,
        roomUniqueId: room.roomUniqueId,
        roomState: 'standby',
        master: room.master,
        userId: room.userId,
        hintReady: 0,
      };

      await this.currentUsersService.exitRoom(exitedUserId);
      await this.roomsService.updateRoom(roomId, payload);
      const roomInfo = await this.roomsService.findRoomById(roomId);
      const currentUser = await this.currentUsersService.currentUsers(roomId);

      let result = [];
      for (let i = 0; i < currentUser.length; i++) {
        result.push({
          ...(await this.usersService.findUserById(currentUser[i].userId)),
          ...currentUser[i],
        });
        result[i].readyState = currentUser[i].readyState;
        delete result[i].password;
      }

      socket
        .to(room.roomUniqueId)
        .emit('update_room', { roomInfo, currentUser: result });
      socket.to(room.roomUniqueId).emit('new_chat', {
        message: `${user.nickname}님이 퇴장하여 게임을 강제종료 합니다.`,
      });
    } else {
      // 방장이 나갔을 때 방 삭제
      await this.roomsService.deleteRoom(roomId);
      await this.currentUsersService.deleteRoom(roomId);
      socket.to(room.roomUniqueId).emit('new_chat', {
        message: `${user.nickname}님이 퇴장하여 게임을 강제종료 합니다.`,
      });
    }
  }
}
