import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create.room.dto';
import { SearchRoomDto } from '../dto/search.room.dto';
import { UpdateRoomDto } from '../dto/update.room.dto';
import { RoomEntity } from '../models/rooms.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOM_REPOSITORY')
    private readonly roomsRepository: Repository<RoomEntity>,
    private readonly usersService: UsersService,
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
    const room = new RoomEntity();
    const { title, password, hintTime, reasoningTime, isRandom } = body;
    const user = await this.usersService.findUserByNickname(master);
    room.title = title;
    room.password = password;
    room.count = 1;
    room.hintTime = hintTime;
    room.reasoningTime = reasoningTime;
    room.isRandom = isRandom;
    room.master = master;
    room.roomUniqueId = uuidv4().toString();
    room.userId = user.id;

    const newRoom = await this.roomsRepository.save(room);
    const result = { ...newRoom };
    return {
      result: { success: true, ...result },
    };
  }

  // 방 수정하기
  async updateRoom(id: number, body: UpdateRoomDto) {
    console.log('수정');
    const existRoom = await this.findRoomById(id);
    if (!existRoom) {
      throw new HttpException('존재하지 않는 방입니다.', 401);
    }

    const result = await this.roomsRepository.update(id, body);
    return { result: { success: true, ...result } };
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

  // 방 찾기
  async searchRoom(body: SearchRoomDto) {
    const { type, inputValue } = body;
    console.log(type, inputValue);

    let roomList;
    if (type == 'TITLE') {
      roomList = await this.roomsRepository
        .createQueryBuilder('Room')
        .where('Room.title LIKE :title', { title: `%${inputValue}%` })
        .getMany();
      console.log(roomList);
    } else {
      roomList = await this.roomsRepository
        .createQueryBuilder('Room')
        .where('Room.master LIKE :master', { master: `%${inputValue}%` })
        .getMany();
    }
    return { result: { success: true, roomList } };
  }
}
