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

@Injectable()
export class ChatService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    private readonly currentUsersService: CurrentUsersService,
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
      users.push(await this.usersService.findUserById(currentUser[i].id));
      users[i].readyState = currentUser[i].readyState;
      delete users[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: result, currentUser: users });
    socket.emit('update_room', { roomInfo: result, currentUser: users });
  }

  async chats(chat: ChatDto, socket: Socket) {
    const { message, nickname, roomId } = chat;
    const room = await this.roomsService.findRoomById(roomId);
    socket
      .to(room.roomUniqueId)
      .emit('new_chat', { message: `${nickname}: ${message}` });
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
    );
    const user = await this.usersService.findUserById(currentUser.userId);
    socket.join(data.roomUniqueId);
    socket.emit('new_chat', { message: '방을 생성합니다.', roomInfo: room });
    socket.emit('update_room', { roomInfo: room, currentUser: [user] });
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname } = data;
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
    await this.currentUsersService.userJoinRoom(userId, room.id);

    socket.join(room.roomUniqueId);
    socket.to(room.roomUniqueId).emit('update_room', {
      message: `${nickname}(${email})님이 입장하셨습니다.`,
      roomInfo: room,
    });
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push(await this.usersService.findUserById(currentUser[i].userId));
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket.emit('update_room', { roomInfo: room, currentUser: result });
  }

  async peerJoin(socket: Socket, data: PeerRoomDto) {
    const { userId, roomId, email, nickname, peerId } = data;
    const room = await this.roomsService.findRoomById(roomId);
    console.log('peerId: ', peerId);
    console.log(room.roomUniqueId);
    socket.join(room.roomUniqueId);
    socket.broadcast.to(room.roomUniqueId).emit('user_connected', peerId);
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
        socket.emit('update_room', { message: '방을 삭제합니다.' });
      } else {
        await this.currentUsersService.exitRoom(userId);
        const currentUser = await this.currentUsersService.currentUsers(roomId);
        if (currentUser.length === 0) {
          await this.roomsService.deleteRoom(room.id);
          return;
        }
        let result = [];
        for (let i = 0; i < currentUser.length; i++) {
          result.push(
            await this.usersService.findUserById(currentUser[i].userId),
          );
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
          userId: result[newMasterNo - 1].id,
          roomState: room.roomState,
          hintReady: room.hintReady,
        };
        await this.roomsService.updateRoom(roomId, payload);
        socket
          .to(room.roomUniqueId)
          .emit('update_room', { success: true, currentUser: result });
      }
    } else {
      if (+room.count === 1) {
        await this.currentUsersService.exitRoom(userId);
        await this.roomsService.deleteRoom(room.id);
        socket.emit('update_room', { message: '방을 삭제합니다.' });
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
        result.push(
          await this.usersService.findUserById(currentUser[i].userId),
        );
        result[i].readyState = currentUser[i].readyState;
        delete result[i].password;
      }
      socket.to(room.roomUniqueId).emit('new_chat', {
        message: `${user.nickname}님이 퇴장했습니다.`,
        currentUser: result,
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
      result.push(await this.usersService.findUserById(users[i].userId));
      result[i].readyState = users[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo: room, currentUser: result });
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
      result.push(await this.usersService.findUserById(currentUser[i].id));
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    const roomInfo = await this.roomsService.findRoomById(+roomId);
    socket.to(room.roomUniqueId).emit('update_room', {
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
      result.push(await this.usersService.findUserById(currentUser[i].id));
      result[i].readyState = currentUser[i].readyState;
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
    socket.to(room.roomUniqueId).emit('update_room', {
      success: true,
      roomInfo: room,
      currentUser: result,
    });
  }

  async hintStart(socket: Socket, userId: number, roomId: number) {
    const room = await this.roomsService.findRoomById(roomId);
    if (room.hintReady !== 2) {
      throw new WsException(
        '모든 유저가 준비완료가 되어야 시작할 수 있습니다.',
      );
    }
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
      hintReady: room.hintReady + 1,
    };
    await this.roomsService.updateRoom(roomId, payload);
    const roomInfo = await this.roomsService.findRoomById(roomId);
    const currentUser = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < currentUser.length; i++) {
      result.push(await this.usersService.findUserById(currentUser[i].id));
      result[i].readyState = currentUser[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_room', { roomInfo, currentUser: result });
  }
}
