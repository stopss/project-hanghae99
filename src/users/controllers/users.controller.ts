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
import { ImageRegisterDto } from '../dto/image.request.dto';

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

  @Post('/login')
  socialLogin(@Body() body) {
    return this.usersService.socialSignup(body);
  }

  @Put('/mypage/:id/update')
  mypageUpdate(@Body() body, @Param('id') id: string) {
    return this.usersService.userUpdate(parseInt(id), body);
  }

  @Get('/mypage/:id')
  mypage(@Param('id') id: string) {
    return this.usersService.getUser(parseInt(id));
  }

  @Put('/mypage/:id/image')
  imageRegister(@Param('id') id: string, @Body() body: ImageRegisterDto) {
    return this.usersService.image(parseInt(id), body);
  }
}
