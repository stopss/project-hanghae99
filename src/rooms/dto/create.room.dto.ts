import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateRoomDto {
  @IsNotEmpty()
  @Transform((value) => sanitizeHtml(value))
  title: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  password: string;

  @IsNotEmpty()
  @Transform((value) => sanitizeHtml(value))
  hintTime: string;

  @IsNotEmpty()
  @Transform((value) => sanitizeHtml(value))
  reasoningTime: string;

  @IsNotEmpty()
  @Transform((value) => sanitizeHtml(value))
  isRandom: string;
}
