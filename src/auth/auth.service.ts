import { UsersService } from '../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './models/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private authRepository: Repository<AuthEntity>,
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

    const token = this.jwtService.sign(payload);
    await this.existAuth(user.id, token);
    return {
      token: token,
    };
  }

  async findAuthByUserId(userId: number) {
    const user = await this.authRepository.findOne({ where: { userId } });
    return user;
  }

  async validateUser(token: string) {
    const result = await this.authRepository.findOne({ where: { token } });
    // console.log('result', result);
    return result;
  }

  async existAuth(id: number, token: string): Promise<any> {
    const auth = new AuthEntity();
    const userExist = await this.authRepository.find({ where: { userId: id } });
    console.log('userExist', userExist);
    if (userExist.length === 0) {
      auth.userId = id;
      auth.token = token;
      await this.authRepository.save(auth);
    } else {
      await this.authRepository.update(id, { token });
    }
  }
}
