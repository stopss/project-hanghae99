import { IsString } from 'class-validator';
export class ExitRoomDto {
  @IsString()
  userId: string;

  @IsString()
  roomId: string;
}
