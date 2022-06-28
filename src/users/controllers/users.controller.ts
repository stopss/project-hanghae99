import { AuthService } from './../../auth/auth.service';
import { UsersService } from './../services/users.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignupUserDto } from '../dto/signup.request.dto';
import { LoginUserDto } from 'src/auth/dto/login.request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getUser(): string {
    return 'user api';
  }

  @Get('/all')
  getAllUser() {
    return this.usersService.findAll();
  }

  @Post('/signup')
  signup(@Body(new ValidationPipe()) body: SignupUserDto) {
    return this.usersService.signup(body);
  }

  @Post('/login')
  login(@Body() body: LoginUserDto) {
    return this.authService.jwtLogin(body);
  }

  @Get('/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  // async kakaoLoginCallback(@Req() req): Promise<{ accessToken: string }> {
  kakaoLoginCallback(@Req() req): string {
    return req.user;
  }

  @Get('/facebook')
  @HttpCode(200)
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req): string {
    return req.user;
  }

  @Get('/naver')
  @HttpCode(200)
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    return HttpStatus.OK;
  }

  @Get('/naver/redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('naver'))
  naverLoginCallback(@Req() req): string {
    return req.user;
  }
}
