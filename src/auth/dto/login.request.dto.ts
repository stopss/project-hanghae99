import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class LoginUserDto {
  @IsEmail()
  @Transform((value) => sanitizeHtml(value))
  email: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  password: string;
}
