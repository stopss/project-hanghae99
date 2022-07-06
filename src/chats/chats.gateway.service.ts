import { UsersService } from './../users/services/users.service';
import { RoomsService } from './../rooms/services/rooms.service';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { CreateRoomDto } from './dto/create.room.dto';
import { v4 as uuidv4 } from 'uuid';
import { JoinRoomDto } from './dto/join.room.dto';
import { WsException } from '@nestjs/websockets';
import { CurrentUsersService } from 'src/current/services/current.service';
import { ExitRoomDto } from './dto/exit.room.dto';

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

  async chats(chat: ChatDto, socket: Socket) {
    const { message, nickname, roomId } = chat;
    const room = await this.roomsService.findRoomById(roomId);
    socket
      .to(room.roomUniqueId)
      .emit('submit_chats', { message: `${nickname}: ${message}` });
  }

  async roomList(socket: Socket) {
    const roomList = await this.roomsService.getAllRoom();
    socket.emit('room_list', roomList);
  }

  async create(socket: Socket, roomUniqueId: string) {
    socket.join(roomUniqueId);
    socket.emit('create_room', { message: '방을 생성합니다.' });
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname } = data;
    const room = await this.roomsService.findRoomById(roomId);
    if (room.count === 5) {
      return new WsException('참가인원이 꽉 찼습니다.');
    }
    const body = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) + 1,
    };
    await this.roomsService.updateRoom(room.id, body);
    await this.currentUsersService.userJoinRoom(userId, room.id);
    socket.join(room.roomUniqueId);
    socket.to(room.roomUniqueId).emit('submit_chat', {
      message: `${nickname}(${email})님이 입장하셨습니다.`,
    });
  }

  async exit(socket: Socket, data: ExitRoomDto) {
    const { userId, roomId } = data;
    await this.currentUsersService.exitRoom(parseInt(userId));
    const exitUser = await this.usersService.findUserById(parseInt(userId));
    const room = await this.roomsService.findRoomById(parseInt(roomId));
    const body = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) - 1,
    };
    await this.roomsService.updateRoom(parseInt(roomId), body);
    socket.to(room.roomUniqueId).emit('submit_chat', {
      message: `${exitUser.nickname}님이 퇴장했습니다.`,
    });
  }
}
