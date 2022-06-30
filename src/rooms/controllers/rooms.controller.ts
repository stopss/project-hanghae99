import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateRoomDto } from '../dto/create.room.dto';
import { RoomsService } from '../services/rooms.service';

@Controller('api')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService
    ) {}

    @Post('/room/create')
    roomCreate(@Body() body: CreateRoomDto) {
        return this.roomsService.createRoom(body);
    }
    


}
