import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create.room.dto';
import { RoomsService } from '../services/rooms.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/room/create')
  roomCreate(@Body() body: CreateRoomDto, @Req() req) {
    const master = req.user.nickname;
    return this.roomsService.createRoom(body, master);
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

  @Get('/room/search')
  roomSearch(@Body() body) {
    return this.roomsService.searchRoom(body);
  }
}
