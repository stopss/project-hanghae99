import { IsString, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  roomId: number;

  @IsString()
  roomUniqueId: string;

  @IsString()
  streamId: string;
}
