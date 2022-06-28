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

  private readonly users = [
    {
      userId: 1,
      nickname: 'jin',
      password: '123',
    },
    {
      userId: 2,
      nickname: 'nwnp',
      password: '123',
    },
  ];

  async findUserByEmail(email: string) {
    try {
      const result = await this.usersRepository.findOne({ where: { email } });
      return result;
    } catch (error) {
      throw new HttpException('존재하지 않는 이메일입니다.', 401);
    }
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async signup(body: SignupUserDto): Promise<any> {
    const user = new UserEntity();
    const { nickname, email, password, token, social } = body;
    const userExist = await this.usersRepository.find({ where: { email } });

    if (userExist.length !== 0) {
      throw new HttpException('이미 존재하는 이메일입니다.', 400);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    user.nickname = nickname;
    user.email = email;
    user.password = hashedPassword;
    user.token = token;
    user.social = social;
    return await this.usersRepository.save(user);
  }
}
