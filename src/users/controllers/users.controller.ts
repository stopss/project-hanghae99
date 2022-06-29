import { AuthService } from './../../auth/auth.service';
import { UsersService } from './../services/users.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { SignupUserDto } from '../dto/signup.request.dto';
import { LoginUserDto } from 'src/auth/dto/login.request.dto';

@Controller('api')
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body(new ValidationPipe()) body: SignupUserDto) {
    return this.usersService.signup(body);
  }

  @Post('/local/login')
  login(@Body() body: LoginUserDto) {
    return this.authService.jwtLogin(body);
  }

  /** TODO: 아래 내용 API 만들기*/

  @Post('/login')
  socialLogin(@Body() body) {
    return this.usersService.socialSignup(body);
  }

  @Put('/mypage/update')
  mypageUpdate(@Body() body) {
    return 'mypage update api';
  }

  @Get('/mypage')
  mypage() {
    return 'mypage api';
  }

  @Post('/mypage/:userId/image')
  imageRegister(@Param() userId: string) {
    return userId;
  }
}
