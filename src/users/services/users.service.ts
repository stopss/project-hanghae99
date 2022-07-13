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
    const result = await this.usersRepository.findOne({ where: { email } });
    return result;
  }

  async findUserByNickname(nickname: string): Promise<any> {
    const result = await this.usersRepository.findOne({
      where: { nickname },
    });
    return result;
  }

  async findUserById(id: number): Promise<any> {
    const result = await this.usersRepository.findOne({ where: { id } });
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
    const newUser = await this.usersRepository.save(user);
    return { result: { success: true, ...newUser } };
  }

  async socialSignup(body) {
    const user = new UserEntity();
    const { email, nickname } = body;
    const userExist = await this.usersRepository.find({ where: { email } });
    if (userExist.length !== 0) {
      const user = await this.findUserByEmail(email);
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash('null', saltOrRounds);
      const payload = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        social: true,
        password: hashedPassword,
        imageUrl: null,
        platform: user.email.split(':')[1],
      };
      await this.usersRepository.update(user.id, payload);
      const token = this.jwtService.sign(payload);
      return { result: { success: true, token } };
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash('null', saltOrRounds);

    user.email = email;
    user.nickname = nickname;
    user.social = true;
    user.password = hashedPassword;
    user.imageUrl = null;
    user.platform = user.email.split(':')[1];
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
  }

  async getUser(id: number) {
    console.log(id);
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
    console.log(existUser);
    await this.usersRepository.update({ id }, { imageUrl });
    return { result: { success: true } };
  }

  async test(roomId: number) {
    let users = await this.currentUsersService.currentUsers(roomId);
    let result = [];
    for (let i = 0; i < users.length; i++) {
      result.push(await this.findUserById(users[i].id));
      result[i].readyState = users[i].readyState;
      delete result[i].password;
    }
    const newMaster = Math.floor(Math.random() * result.length + 1);
    console.log(result);
    // let random = [];
    // let i = 0;
    // while (i < 6) {
    //   let n = Math.floor(Math.random() * 5) + 1;
    //   if (!random.find((e) => e === n)) {
    //     random.push(n);
    //     i++;
    //   }
    // }
    // console.log(random);
    return result;
  }
}
