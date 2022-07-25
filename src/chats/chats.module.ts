import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatService } from './chats.gateway.service';
import { UsersModule } from 'src/users/users.module';
import { CurrentUsersModule } from './../current/current.users.module';
import { EpisodeModule } from 'src/episode/episode.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    RoomsModule,
    UsersModule,
    CurrentUsersModule,
    EpisodeModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
