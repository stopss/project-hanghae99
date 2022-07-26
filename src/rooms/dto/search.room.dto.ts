import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class SearchRoomDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  type: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  inputValue: string;
}
