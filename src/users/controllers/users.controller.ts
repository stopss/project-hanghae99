import { UsersService } from './../services/users.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { SignupUserDto } from '../dto/signup.request.dto';

@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
