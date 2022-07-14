import { IsNumber, IsString } from 'class-validator';

export class PeerRoomDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  roomId: number;

  @IsString()
  peerId: string;
}