import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class PeerRoomDto {
  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  userId: number;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  roomId: number;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  peerId: string;
}
