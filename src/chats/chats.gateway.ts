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
import { HintDto } from './dto/hint.dto';

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
  handlExitRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ExitRoomDto,
  ) {
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
  @SubscribeMessage('ready_state')
  handleReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    return this.chatService.ready(socket, data.userId, data.roomId);
  }

  @SubscribeMessage('game_start')
  handleStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    return this.chatService.start(socket, data.userId, data.roomId);
  }

  @SubscribeMessage('hint_ready')
  handleHintReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    return this.chatService.hintReady(socket, +data.userId, +data.roomId);
  }

  @SubscribeMessage('hint_start')
  handleHintStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    return this.chatService.hintStart(socket, +data.userId, +data.roomId);
  }

  @SubscribeMessage('hint_register')
  handleHintRegister(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string; imageId: string },
  ) {
    return this.chatService.hintRegister(
      socket,
      +data.userId,
      +data.roomId,
      data.imageId,
    );
  }

  @SubscribeMessage('reasoning_time')
  handleReasoningTime(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.chatService.reasoningTime(socket, +data.roomId);
  }

  @SubscribeMessage('hint_board')
  handleHintInBoard(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomInfo: HintDto; roomId: string },
  ) {
    return this.chatService.hintInBoard(socket, data.roomInfo, +data.roomId);
  }
}
