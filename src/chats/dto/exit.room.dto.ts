import { IsString, IsNumber } from 'class-validator';
export class ExitRoomDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  roomId: number;
}
