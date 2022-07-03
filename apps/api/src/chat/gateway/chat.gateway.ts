import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  public async handleConnection(socket: Socket): Promise<void> {
    await this.chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  public async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, author);

    this.server.sockets.emit('receive_message', message);
  }

  @SubscribeMessage('request_all_messages')
  public async requestAllMessages(@ConnectedSocket() socket: Socket): Promise<void> {
    await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages();

    socket.emit('send_all_messages', messages);
  }
}
