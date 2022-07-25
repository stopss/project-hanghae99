import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class ImageRegisterDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  imageUrl: string;
}
