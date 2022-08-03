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

  @SubscribeMessage('test')
  test(@ConnectedSocket() Socket: Socket, @MessageBody() test: string) {
    return this.chatService.test(test);
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

  @SubscribeMessage('offer')
  handleOffer(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    return this.chatService.offer(socket, data);
  }

  @SubscribeMessage('answer')
  handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    return this.chatService.answer(socket, data);
  }

  @SubscribeMessage('ice')
  handleIce(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    return this.chatService.ice(socket, data);
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

  @SubscribeMessage('role_choice_time')
  handleRoleChoiceTime(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.chatService.hintRoleChoiceTime(socket, +data.roomId);
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
    @MessageBody()
    data: {
      imageInfo: any;
      roomId: string;
    },
  ) {
    return this.chatService.hintInBoard(socket, data.imageInfo, +data.roomId);
  }

  @SubscribeMessage('kick_user')
  handleKickUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { roomId: string; kickedUserId: string; masterUserId: string },
  ) {
    return this.chatService.kickUser(
      socket,
      +data.roomId,
      +data.kickedUserId,
      +data.masterUserId,
    );
  }

  @SubscribeMessage('choice_role')
  hanldeChoiceRole(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string; episodeId: string },
  ) {
    return this.chatService.choiceRole(
      socket,
      +data.roomId,
      +data.userId,
      +data.episodeId,
    );
  }

  @SubscribeMessage('force_quit')
  handleForceQuit(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    return this.chatService.forceQuit(socket, +data.roomId, +data.userId);
  }

  @SubscribeMessage('role_info')
  handleRoleInfo(@ConnectedSocket() socket: Socket) {
    return this.chatService.roleInfo(socket);
  }

  @SubscribeMessage('game_end')
  handleGameEnd(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.chatService.end(socket, +data.roomId);
  }

  @SubscribeMessage('image_list')
  handleRegisterImageLists(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      imageUrlLists: Array<string>;
    },
  ) {
    return this.chatService.registerImageLists(
      +data.roomId,
      +data.userId,
      data.imageUrlLists,
    );
  }

  @SubscribeMessage('vote')
  handleVote(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userId: string; roomId: string },
  ) {
    return this.chatService.vote(socket, +data.roomId, +data.userId);
  }
}
