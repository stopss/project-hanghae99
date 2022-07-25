import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class UpdateRoomDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  title: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  password: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  hintTime: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  reasoningTime: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  isRandom: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  roomId: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  master: string;
}
