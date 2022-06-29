// import { AppService } from './app.service';
import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  chat() {
    return {
      data: 'Chattings',
    };
  }
}
