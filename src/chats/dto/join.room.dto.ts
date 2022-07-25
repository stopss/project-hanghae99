import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsEmail } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class JoinRoomDto {
  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  userId: number;

  @IsEmail()
  @Transform((value) => sanitizeHtml(value))
  email: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  nickname: string;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  roomId: number;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  streamId: string;
}
