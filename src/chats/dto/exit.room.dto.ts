import { Transform } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class ExitRoomDto {
  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  userId: number;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  roomId: number;
}
