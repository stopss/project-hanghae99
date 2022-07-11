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
    const { title, password, hintTime, reasoningTime, isRandom, roomId } = data;
    const room = await this.roomsService.findRoomById(roomId);
    const paylod = {
      title,
      password,
      hintTime,
      reasoningTime,
      isRandom,
      count: room.count,
    };
    const updatedRoom = await this.roomsService.updateRoom(roomId, paylod);
    socket.to(room.roomUniqueId).emit('update_room', { roomInfo: updatedRoom });
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
    socket.to(room.roomUniqueId).emit('new_chat', {
      message: `${nickname}(${email})님이 입장하셨습니다.`,
      roomInfo: room,
    });
  }

  async exit(socket: Socket, data: ExitRoomDto) {
    const { userId, roomId } = data;
    await this.currentUsersService.exitRoom(parseInt(userId));
    const user = await this.usersService.findUserById(parseInt(userId));
    const room = await this.roomsService.findRoomById(parseInt(roomId));

    // 방장이 나갔을 때
    if (user.nickname === room.nickname) {
      console.log('방장이 나감')

      // TODO: 현재 유저 중에서 랜덤으로 방장을 넘김 -> RoomEntity Update(master, userId, count) -> CurrentUser에서 방장 userId 삭제
      // TODO: 현재 유저들에게 방장이 바뀌었다고 채팅으로 알림
    }

    const payload = {
      title: room.title,
      password: room.password,
      hintTime: room.hintTime,
      reasoningTime: room.reasoningTime,
      isRandom: room.isRandom,
      count: parseInt(room.count) - 1,
    };
    await this.roomsService.updateRoom(parseInt(roomId), payload);
    await this.currentUsersService.exitRoom(parseInt(user.userId));
    socket.to(room.roomUniqueId).emit('new_chat', {
      message: `${user.nickname}님이 퇴장했습니다.`,
    });
  }
}
