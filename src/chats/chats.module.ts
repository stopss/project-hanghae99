import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatService } from './chats.gateway.service';
import { UsersModule } from 'src/users/users.module';
import { CurrentUsersModule } from './../current/current.users.module';
import { EpisodeModule } from 'src/episode/episode.module';
import { ImagesModule } from 'src/images/images.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RoomsModule,
    UsersModule,
    CurrentUsersModule,
    EpisodeModule,
    ImagesModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
