import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create.room.dto';
import { RoomsService } from '../services/rooms.service';

@UseGuards(JwtAuthGuard)
@Controller('api')
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

  @Get('/room/list')
  roomGetAll() {
    return this.roomsService.getAllRoom();
  }

  @Get('/room/search')
  roomSearch(@Query() query) {
    return this.roomsService.searchRoom(query);
  }

  @Post('/room/chkpassword/:roomId')
  roomChkPassword(@Param('roomId') id: string, @Body() body) {
    return this.roomsService.chkPasswordRoom(parseInt(id), body);
  }

  @Put('/room/ban/:roomId')
  roomBanUser(@Param('roomId') id: string, @Body() body) {
    return this.roomsService.banUsers(parseInt(id), body.userId);
  }
}
