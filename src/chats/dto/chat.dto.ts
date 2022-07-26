import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNumber } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class ChatDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  message: string;

  @IsEmail()
  @Transform((value) => sanitizeHtml(value))
  email: string;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  userId: number;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  roomId: number;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  nickname: string;
}
