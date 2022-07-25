import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class SignupUserDto {
  @IsString()
  @Transform((value) => sanitizeHtml(value))
  nickname: string;

  @IsEmail()
  @Transform((value) => sanitizeHtml(value))
  email: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  password: string;

  @IsString()
  @Transform((value) => sanitizeHtml(value))
  passwordCheck: string;
}
