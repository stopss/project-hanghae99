import { CurrentUsersService } from './../services/current.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('current')
export class CurrentController {
  constructor(private readonly currentUsersService: CurrentUsersService) {}

  @Get('/:id')
  test(@Param('id') id: number) {
    return this.currentUsersService.currentUsers(id);
  }
}
