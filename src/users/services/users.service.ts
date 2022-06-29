import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupUserDto } from '../dto/signup.request.dto';
import { UserEntity } from '../models/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string) {
    try {
      const result = await this.usersRepository.findOne({ where: { email } });
      return result;
    } catch (error) {
      throw new HttpException('존재하지 않는 이메일입니다.', 401);
    }
  }

  async findUserByNickname(nickname: string): Promise<any> {
    const result = await this.usersRepository.findOne({
      where: { nickname },
    });
    return result;
  }

  async signup(body: SignupUserDto): Promise<any> {
    const user = new UserEntity();
    const { nickname, email, password, passwordCheck } = body;
    const userExist = await this.usersRepository.find({ where: { email } });
    const isExistNickname = await this.findUserByNickname(nickname);
    const social = false;

    if (userExist.length !== 0)
      throw new HttpException('이미 존재하는 이메일입니다.', 400);

    if (password !== passwordCheck)
      throw new HttpException('비밀번호를 다시 확인해주세요.', 400);

    if (isExistNickname !== null)
      throw new HttpException('이미 존재하는 닉네임입니다.', 400);

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    user.nickname = nickname;
    user.email = email;
    user.password = hashedPassword;
    user.social = social;
    user.refreshToken = null;
    const result = await this.usersRepository.save(user);
    return result;
  }

  async socialSignup(body) {
    const result = { result: { success: true, ...body } };
    return result;
  }
}
