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
import { UseGuards, Logger } from '@nestjs/common';
import { WsGuard } from '../auth/ws.guard';
import { JwtService } from '@nestjs/jwt';

interface UserPayload {
  id: string;
  email: string;
  username: string;
}

interface IncomingMessage {
  room: string;
  message: string;
  color: string;
  timestamp?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<
    string,
    { username: string; room: string }
  >();

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    this.logger.log(`Tentative de connexion : ${client.id}`);

    const token = client.handshake?.auth?.token as string | undefined;
    if (!token) {
      this.logger.warn(`❌ Pas de token fourni`);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<UserPayload>(token);
      (client.data as { user?: UserPayload }).user = payload;

      this.logger.log(`✅ Connecté : ${client.id} (${payload.username})`);
    } catch {
      this.logger.warn(`❌ Token invalide`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userEntry = this.connectedUsers.get(client.id);
    if (userEntry) {
      const { username, room } = userEntry;
      this.connectedUsers.delete(client.id);
      this.logger.log(
        `❌ Déconnecté : ${client.id} (${username}) de la room ${room}`,
      );
      this.broadcastUsers(room);
      this.server.to(room).emit('message', {
        sender: 'System',
        message: `${username} a quitté la room.`,
        color: 'gray',
      });
    } else {
      this.logger.warn(`Déconnexion inconnue : ${client.id}`);
    }
  }

  private broadcastUsers(room: string): void {
    const usersInRoom = Array.from(this.connectedUsers.values())
      .filter((u) => u.room === room)
      .map((u) => ({ username: u.username }));

    this.logger.log(
      `📡 Envoi des utilisateurs room "${room}" : ${JSON.stringify(usersInRoom)}`,
    );
    this.server.to(room).emit('users', usersInRoom);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      client.join(data.room);
      this.connectedUsers.set(client.id, {
        username: user.username,
        room: data.room,
      });

      this.logger.log(`🚪 ${user.username} a rejoint la room ${data.room}`);

      this.server.to(data.room).emit('message', {
        sender: 'System',
        message: `${user.username} a rejoint la room.`,
        color: 'gray',
      });

      this.broadcastUsers(data.room);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IncomingMessage,
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    const userEntry = this.connectedUsers.get(client.id);

    if (user && user.username && userEntry) {
      const room = userEntry.room;
      this.logger.log(`💬 [${room}] ${user.username} : ${data.message}`);

      this.server.to(room).emit('message', {
        sender: user.username,
        message: data.message,
        color: data.color,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    } else {
      this.logger.warn(`Message sans utilisateur identifié`);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      this.logger.log(
        `✏️ ${user.username} est en train d'écrire dans ${data.room}`,
      );
      client.to(data.room).emit('typing', {
        username: user.username,
      });
    }
  }
}
