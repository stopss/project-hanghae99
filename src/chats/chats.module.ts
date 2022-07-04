import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatService } from './chats.gateway.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [RoomsModule, UsersModule],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
