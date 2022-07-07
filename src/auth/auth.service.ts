import { UsersService } from '../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginUserDto) {
    const { email, password } = data;
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 혹은 비밀번호를 다시 확인해주세요.',
      );
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException(
        '이메일 혹은 비밀번호를 다시 확인해주세요.',
      );
    }
    const payload = {
      email: email,
      sub: user.id,
      nickname: user.nickname,
      social: user.social,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
