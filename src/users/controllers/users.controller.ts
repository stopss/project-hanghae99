import { UsersService } from './../services/users.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import { Controller, Get, UseFilters } from '@nestjs/common';

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
}
