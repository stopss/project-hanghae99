import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
