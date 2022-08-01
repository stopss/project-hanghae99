import { IsString, IsEmail, IsNumber } from 'class-validator';

export class ChatDto {
  @IsString()
  message: string;

  @IsEmail()
  email: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  roomId: number;

  @IsString()
  nickname: string;

  @IsString()
  at: string;
}
