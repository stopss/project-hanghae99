import { CurrentUsersService } from './../services/current.service';
import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('api')
export class CurrentController {
  constructor(private readonly currentUsersService: CurrentUsersService) {}

  @Get('/:id')
  test(@Param('id') id: number) {
    return this.currentUsersService.currentUsers(id);
  }

  @Post('/vote/:votedUserId')
  vote(@Param('votedUserId') votedUserId: string) {
    return this.currentUsersService.vote(+votedUserId);
  }
}
