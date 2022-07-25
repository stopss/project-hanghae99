import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class UpdateUserDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  password: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  nickname: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  imageUrl: string;
}
