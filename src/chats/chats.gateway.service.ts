import { RoomsService } from './../rooms/services/rooms.service';
import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { CreateRoomDto } from './dto/create.room.dto';
import { v4 as uuidv4 } from 'uuid';
import { JoinRoomDto } from './dto/join.room.dto';

@Injectable()
export class ChatService {
  constructor(private readonly roomsService: RoomsService) {}
  private logger = new Logger('CHATTING');

  connection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }

  disconnection(socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  chats(chat: ChatDto, socket: Socket) {
    const { message, email, nickname, userId, roomId } = chat;
    console.log(message, email, nickname, userId, roomId);
    socket.broadcast.emit('new_chat', { message });
    return message;
  }

  async roomList(socket: Socket) {
    const roomList = await this.roomsService.getAllRoom();
    socket.emit('room_list', roomList);
  }

  async create(socket: Socket, master: string, roomData: CreateRoomDto) {
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
    console.log(newRoom);
    socket.broadcast.emit('new_room', newRoom);
  }

  async join(socket: Socket, data: JoinRoomDto) {
    const { userId, roomId, email, nickname } = data;
    const existRoom = await this.roomsService.findRoomById(roomId);
    socket.join(`${existRoom.roomId}`);
    // await this.roomsService.updateRoom(existRoom.id, );
    socket.to(`${roomId}`).emit('new_chat', {
      nickname: `${nickname}`,
      message: `${nickname}(${email})님이 입장하셨습니다.`,
    });
  }
}
