import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
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

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  count: number;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  roomUniqueId: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  roomState: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  master: string;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  userId: number;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  hintReady: number;
}
