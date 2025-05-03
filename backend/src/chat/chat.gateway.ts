import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*', // à restreindre plus tard en prod
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    data: { sender: string; message: string; color: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Message from ${data.sender}: ${data.message}`);
    this.server.emit('message', data); // diffuse à tous les clients connectés
  }
}
