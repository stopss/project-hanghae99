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
  Req,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignupUserDto } from '../dto/signup.request.dto';
import { LoginUserDto } from 'src/auth/dto/login.request.dto';
import { ImageRegisterDto } from '../dto/image.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

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
  login(@Body() body: { email: string; password: string }) {
    console.log(body);
    return this.authService.jwtLogin(body);
  }

  @Post('/login')
  socialLogin(@Body() body) {
    return this.usersService.socialSignup(body);
  }

  @Put('/mypage/update')
  @UseGuards(JwtAuthGuard)
  mypageUpdate(@Body() body, @Req() req) {
    return this.usersService.userUpdate(req.user.id, body);
  }

  @Get('/mypage')
  @UseGuards(JwtAuthGuard)
  mypage(@Req() req) {
    console.log(req.user, typeof req.user.sub);
    return this.usersService.getUser(req.user.sub);
  }

  @Post('/mypage/image')
  @UseGuards(JwtAuthGuard)
  imageRegister(@Req() req, @Body() body: ImageRegisterDto) {
    return this.usersService.image(req.user.sub, body);
  }

  @Get('/test/:id')
  test(@Param('id') id: number) {
    return this.usersService.test(id);
  }
}
