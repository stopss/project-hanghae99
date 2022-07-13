import { ChatService } from './chats.gateway.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { JoinRoomDto } from './dto/join.room.dto';
import { ExitRoomDto } from './dto/exit.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { CreateRoomDto } from './dto/create.room.dto';
import { PeerRoomDto } from './dto/peer.room.dto';

@WebSocketGateway({
  transports: ['websocket'],
  cors: { origin: '*' },
  // namespace: 'chattings'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  handleConnection(@ConnectedSocket() socket: Socket) {
    return this.chatService.connected(socket);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    return this.chatService.disconnected(socket);
  }

  @SubscribeMessage('submit_chat') handleSubmitChat(
    @MessageBody() chat: ChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.chats(chat, socket);
  }

  @SubscribeMessage('room_list')
  handleRoomList(@ConnectedSocket() socket: Socket) {
    return this.chatService.roomList(socket);
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    return this.chatService.create(socket, data);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinRoomDto,
  ) {
    return this.chatService.join(socket, data);
  }

  @SubscribeMessage('exit_room')
  handlExitRoom(@ConnectedSocket() socket: Socket, data: ExitRoomDto) {
    return this.chatService.exit(socket, data);
  }

  @SubscribeMessage('get_room')
  handleGetRoomInfo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.chatService.getRoomInfo(parseInt(data.roomId), socket);
  }

  @SubscribeMessage('update_room')
  handleUpdateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: UpdateRoomDto,
  ) {
    return this.chatService.update(data, socket);
  }

  @SubscribeMessage('peer_join_room')
  handlePeerJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: PeerRoomDto,
  ) {
    return this.chatService.peerJoin(socket, data);
  }
}
