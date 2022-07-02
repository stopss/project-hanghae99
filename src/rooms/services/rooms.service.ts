import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create.room.dto';
import { UpdateRoomDto } from '../dto/update.room.dto';
import { RoomEntity } from '../models/rooms.entity';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOM_REPOSITORY')
    private readonly roomsRepository: Repository<RoomEntity>,
  ) {}

  async findRoomById(id: number): Promise<any> {
    const result = await this.roomsRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('존재하지 않는 방입니다.');
    }

    return result;
  }

  // 방 만들기
  async createRoom(body: CreateRoomDto, master: string): Promise<any> {
    try {
      const room = new RoomEntity();
      const { title, password, hintTime, reasoningTime, isRandom } = body;
      room.title = title;
      room.password = password;
      room.count = 1;
      room.hintTime = hintTime;
      room.reasoningTime = reasoningTime;
      room.isRandom = isRandom;
      room.master = master;

      const newRoom = await this.roomsRepository.save(room);

      return {
        result: { success: true, master: newRoom.master, roomId: newRoom.id },
      };
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  // 방 수정하기
  async updateRoom(id: number, body: UpdateRoomDto) {
    console.log('수정');
    const existRoom = await this.findRoomById(id);
    if (!existRoom) {
      throw new HttpException('존재하지 않는 방입니다.', 401);
    }

    await this.roomsRepository.update(id, body);
    return { result: { success: true } };
  }

  // 방 삭제하기
  async deleteRoom(id: number) {
    const existRoom = await this.findRoomById(id);
    if (!existRoom) {
      throw new HttpException('존재하지 않는 방입니다.', 401);
    }

    await this.roomsRepository.delete(id);

    return { result: { success: true } };
  }

  // 방 목록
  async getAllRoom(): Promise<any> {
    const roomList = await this.roomsRepository.find();
    return { result: { roomList } };
  }
}
