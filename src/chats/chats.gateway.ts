import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatGateway implements OnGatewayConnection {
  private logger = new Logger('chat');

  handleConnection(
    @ConnectedSocket()
    socket: Socket,
  ) {
    this.logger.log(`connected: ${socket.id}`);
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('front -> back:', chat);
    socket.broadcast.emit('new_chat', { chat });
  }
}
