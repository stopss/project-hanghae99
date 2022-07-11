import { IsNumber, IsString, IsEmail } from 'class-validator';

export class PeerRoomDto {
  @IsNumber()
  userId: number;

  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsNumber()
  roomId: number;

  @IsString()
  peerId: string;
}