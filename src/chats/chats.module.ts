import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatService } from './chats.gateway.service';

@Module({
  imports: [RoomsModule],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
