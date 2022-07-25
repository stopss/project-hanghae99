import { Transform } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateRoomDto {
  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  roomId: number;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  roomUniqueId: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  streamId: string;
}
