import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatsModule {}
