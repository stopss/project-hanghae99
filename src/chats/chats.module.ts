import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatService } from './chats.gateway.service';
import { UsersModule } from 'src/users/users.module';
import { CurrentUsersModule } from './../current/current.users.module';

@Module({
  imports: [RoomsModule, UsersModule, CurrentUsersModule],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
