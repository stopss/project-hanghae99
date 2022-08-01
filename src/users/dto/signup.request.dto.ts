import { IsEmail, IsString } from 'class-validator';

export class SignupUserDto {
  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  passwordCheck: string;
}
