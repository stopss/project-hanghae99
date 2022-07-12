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
    const paylod = {
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
    };
    const updatedRoom = await this.roomsService.updateRoom(
      parseInt(roomId),
      paylod,
    );
    socket.to(room.roomUniqueId).emit('update_room', { roomInfo: updatedRoom });
    socket.emit('update_room', { roomInfo: updatedRoom });
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
    socket.join(data.roomUniqueId);
    socket.emit('new_chat', { message: '방을 생성합니다.', roomInfo: room });
    socket.emit('update_room', { roomInfo: room });
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname } = data;
    const room = await this.roomsService.findRoomById(roomId);
    if (room.count === 5) return new WsException('참가인원이 꽉 찼습니다.');
    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) + 1,
    };
    await this.roomsService.updateRoom(room.id, payload);
    await this.currentUsersService.userJoinRoom(userId, room.id);
    socket.join(room.roomUniqueId);
    socket.to(room.roomUniqueId).emit('update_room', {
      message: `${nickname}(${email})님이 입장하셨습니다.`,
      roomInfo: room,
    });
    socket.emit('update_room', { roomInfo: room });
  }

  async exit(socket: Socket, data: ExitRoomDto) {
    const { userId, roomId } = data;
    await this.currentUsersService.exitRoom(userId);
    const user = await this.usersService.findUserById(userId);
    const room = await this.roomsService.findRoomById(roomId);

    if (user.nickname === room.master) {
      await this.currentUsersService.exitRoom(userId);
      const currentUser = await this.currentUsersService.currentUsers(roomId);
      let result = [];
      for (let i = 0; i < currentUser.length; i++) {
        result.push(await this.usersService.findUserById(currentUser[i].id));
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
      };
      await this.roomsService.updateRoom(roomId, payload);
      socket
        .to(room.roomUniqueId)
        .emit('update_chat', { success: true, currentUser: result });
    }

    if (+room.count === 1) {
      await this.roomsService.deleteRoom(room.id);
      await this.currentUsersService.exitRoom(parseInt(user.userId));
    }

    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) - 1,
    };
    await this.roomsService.updateRoom(roomId, payload);
    await this.currentUsersService.exitRoom(parseInt(user.userId));
    socket.to(room.roomUniqueId).emit('new_chat', {
      message: `${user.nickname}님이 퇴장했습니다.`,
    });
  }

  async ready(socket: Socket, userId: string, roomId: string) {
    const users = await this.currentUsersService.readyStateUpdate(
      +userId,
      +roomId,
    );
    const room = await this.roomsService.findRoomById(+roomId);
    let result = [];
    for (let i = 0; i < users.length; i++) {
      result.push(await this.usersService.findUserById(users[i].id));
      result[i].readyState = users[i].readyState;
      delete result[i].password;
    }
    socket
      .to(room.roomUniqueId)
      .emit('update_chat', { roomInfo: room, currentUser: result });
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
    // TODO: 방 정보 가져오기
    // TODO: CurrentUser 가져오기
  }
}
