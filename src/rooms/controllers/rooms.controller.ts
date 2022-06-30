import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create.room.dto';
import { RoomsService } from '../services/rooms.service';

@Controller('api')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/room/create')
  roomCreate(@Body() body: CreateRoomDto) {
    return this.roomsService.createRoom(body);
  }

  @Put('/room/update/:roomId')
  roomUpdate(@Param('roomId') id: string, @Body() body) {
    return this.roomsService.updateRoom(parseInt(id), body);
  }

  @Delete('/room/delete/:roomId')
  roomDelete(@Param('roomId') id: string) {
    return this.roomsService.deleteRoom(parseInt(id));
  }

  @Get('/rooms')
  roomGetAll(): Promise<any> {
    return this.roomsService.getAllRoom();
  }
}
