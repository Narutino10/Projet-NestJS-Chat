import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/ws.guard';

interface UserPayload {
  id: string;
  email: string;
  username: string;
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

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket): void {
    const user = (client.data as { user: UserPayload }).user;
    if (user && user.username) {
      this.connectedUsers.set(client.id, user.username);
      this.broadcastUsers();
      console.log(`Client connected: ${client.id} (${user.username})`);
    }
  }

  handleDisconnect(client: Socket): void {
    const user = (client.data as { user: UserPayload }).user;
    if (user && user.username) {
      this.connectedUsers.delete(client.id);
      this.broadcastUsers();
      console.log(`Client disconnected: ${client.id} (${user.username})`);
    }
  }

  private broadcastUsers(): void {
    const users = Array.from(this.connectedUsers.entries()).map(
      ([id, username]) => ({
        id,
        username,
      }),
    );
    this.server.emit('users', users);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      message: string;
      color: string;
    },
  ): void {
    const user = (client.data as { user: UserPayload }).user;
    if (user && user.username) {
      console.log(`Message from ${user.username}: ${data.message}`);

      this.server.emit('message', {
        sender: user.username,
        message: data.message,
        color: data.color,
      });
    }
  }
}
