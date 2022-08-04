// import { AppService } from './app.service';
import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { EpisodeService } from './episode/services/episode.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Get('roles')
  // @Render('test')
  roles() {
    return this.episodeService.allRole();
    // return {
    //   data: 'Chattings',
    // };
  }

  @Get('/test')
  test() {
    return 'hello world!!!!!';
  }
}
