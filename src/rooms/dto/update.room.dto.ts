import { CreateRoomDto } from './create.room.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
