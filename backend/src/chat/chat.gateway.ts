import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsGuard } from '../auth/ws.guard';

interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

interface SafeSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*', // à restreindre plus tard en prod
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private _server!: Server;

  private get server(): Server {
    return this._server;
  }

  handleConnection(client: SafeSocket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: SafeSocket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: SafeSocket,
    @MessageBody()
    data: {
      message: string;
      color: string;
    },
  ): void {
    const user: JwtPayload = client.data.user;

    if (!user) {
      console.warn('No user attached to client data');
      return;
    }

    console.log(`Message from ${user.username}: ${data.message}`);

    this.server.emit('message', {
      sender: user.username,
      message: data.message,
      color: data.color,
    });
  }
}
