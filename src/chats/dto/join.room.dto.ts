import { IsNumber, IsString, IsEmail } from 'class-validator';

export class JoinRoomDto {
  @IsNumber()
  userId: number;

  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsNumber()
  roomId: number;

  @IsString()
  password: string;
}
