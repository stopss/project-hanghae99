import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class HintDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  id: string;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  x: number;

  @IsNumber()
  @Transform((value) => sanitizeHtml(value))
  y: number;

  @IsBoolean()
  @Transform((value) => sanitizeHtml(value))
  isDropped: boolean;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  previewUrl: string;
}
