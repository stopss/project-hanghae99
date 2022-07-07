import { CurrentUsersService } from './../../current/services/current.service';
import { UpdateUserDto } from './../dto/update.request.dto';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupUserDto } from '../dto/signup.request.dto';
import { UserEntity } from '../models/users.entity';
import * as bcrypt from 'bcrypt';
import { ImageRegisterDto } from '../dto/image.request.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly currentUsersService: CurrentUsersService,
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
    try {
      const result = await this.usersRepository.findOne({
        where: { nickname },
      });
      return result;
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async findUserById(id: number): Promise<any> {
    try {
      const result = await this.usersRepository.findOne({ where: { id } });
      return result;
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async signup(body: SignupUserDto): Promise<any> {
    try {
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
      const newUser = await this.usersRepository.save(user);
      return { result: { success: true, ...newUser } };
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async socialSignup(body) {
    try {
      const user = new UserEntity();
      const { email, nickname } = body;
      const userExist = await this.usersRepository.find({ where: { email } });
      if (userExist.length !== 0) {
        const user = await this.findUserByEmail(email);
        const payload = {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          social: true,
        };
        const token = this.jwtService.sign(payload);
        return { result: { success: true, token } };
      }
      user.email = email;
      user.nickname = nickname;
      user.social = true;
      user.password = null;
      const newUser = await this.usersRepository.save(user);
      const payload = {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        social: true,
      };
      const token = this.jwtService.sign(payload);
      return {
        result: { success: true, token },
      };
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async getUser(id: number) {
    const result = await this.currentUsersService.getLog(id);
    return { result: { success: true, ...result } };
  }

  async userUpdate(id: number, updatedData: UpdateUserDto) {
    const { password, nickname, imageUrl } = updatedData;
    const user = new UserEntity();
    const saltOrRounds = parseInt(process.env.BCRYPT_ROUND_OR_SALT);
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const isExistNickname = await this.findUserByNickname(nickname);
    if (isExistNickname)
      throw new HttpException('이미 존재하는 닉네임입니다.', 400);
    user.nickname = nickname;
    user.imageUrl = imageUrl;
    user.password = hashedPassword;
    await this.usersRepository.update(id, user);
    return { result: { success: true } };
  }

  async image(id: number, body: ImageRegisterDto) {
    const { imageUrl } = body;
    const existUser = await this.findUserById(id);
    if (!existUser) throw new HttpException('존재하지 않는 회원입니다.', 401);
    await this.usersRepository.update({ id }, { imageUrl });
    return { result: { success: true } };
  }
}
