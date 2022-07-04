import { UsersService } from './../users/services/users.service';
import { RoomsService } from './../rooms/services/rooms.service';
import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { CreateRoomDto } from './dto/create.room.dto';
import { v4 as uuidv4 } from 'uuid';
import { JoinRoomDto } from './dto/join.room.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}
  private logger = new Logger('CHATTING');

  connection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }

  disconnection(socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  async chats(chat: ChatDto, socket: Socket) {
    const { message, email, nickname, userId, roomId } = chat;
    const room = await this.roomsService.findRoomById(roomId);
    socket.join(`${room.roomId}`);
    socket
      .to(`${room.roomUniqueId}`)
      .emit('new_chat', { message: `${nickname}: ${message}` });
  }

  async roomList(socket: Socket) {
    const roomList = await this.roomsService.getAllRoom();
    socket.emit('room_list', roomList);
  }

  async create(socket: Socket, userId: number, roomData: CreateRoomDto) {
    const user = await this.usersService.findUserById(userId);
    const master = user.nickname;
    const roomUniqueId = `${uuidv4()}`;
    const payload = {
      title: roomData.title,
      password: roomData.password,
      hintTime: roomData.hintTime,
      reasoningTime: roomData.reasoningTime,
      isRandom: roomData.isRandom,
      roomUniqueId,
    };
    const newRoom = await this.roomsService.createRoom(payload, master);
    socket.join(roomUniqueId);
    socket.emit('new_room', newRoom);
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname } = data;
    const room = await this.roomsService.findRoomById(roomId);
    if (room.count === 5) {
      return new WsException('참가인원이 꽉 찼습니다.');
    }
    const count = room.count + 1;
    await this.roomsService.updateRoom(room.id, count);
    socket.join(`${room.roomId}`);
    socket.to(`${room.roomUniqueId}`).emit('new_chat', {
      nickname: `${nickname}`,
      message: `${nickname}(${email})님이 입장하셨습니다.`,
    });
  }
}
