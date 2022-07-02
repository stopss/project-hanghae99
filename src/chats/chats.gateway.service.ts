import { RoomsService } from './../rooms/services/rooms.service';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { CreateRoomDto } from './dto/create.room.dto';

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
    const { message, url } = chat;
    console.log(url);
    socket.broadcast.emit('new_chat', { message });
    return message;
  }

  async roomList(socket: Socket) {
    const roomList = await this.roomsService.getAllRoom();
    socket.emit('room_list', roomList);
  }

  async create(socket: Socket, master: string, roomData: CreateRoomDto) {
    const newRoom = await this.roomsService.createRoom(roomData, master);
    socket.emit('new_room', newRoom);
  }
}
