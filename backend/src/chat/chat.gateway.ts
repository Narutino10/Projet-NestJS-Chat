// ✅ ChatGateway complet et prêt à coller
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
  message: string;
  color: string;
  timestamp: string;
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
  private connectedUsers = new Map<string, string>();

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

      this.connectedUsers.set(client.id, payload.username);
      this.logger.log(`✅ Connecté : ${client.id} (${payload.username})`);
      this.broadcastUsers();
    } catch {
      this.logger.warn(`❌ Token invalide`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      this.connectedUsers.delete(client.id);
      this.logger.log(`❌ Déconnecté : ${client.id} (${user.username})`);
      this.broadcastUsers();
    } else {
      this.logger.warn(`Déconnexion inconnue : ${client.id}`);
    }
  }

  private broadcastUsers(): void {
    const users = Array.from(this.connectedUsers.entries()).map(
      ([id, username]) => ({
        id,
        username,
      }),
    );
    this.logger.log(`📡 Envoi des utilisateurs : ${JSON.stringify(users)}`);
    this.server.emit('users', users);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IncomingMessage,
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      this.logger.log(`💬 Message de ${user.username} : ${data.message}`);
      this.server.emit('message', {
        sender: user.username,
        message: data.message,
        color: data.color,
        timestamp: data.timestamp,
      });
    } else {
      this.logger.warn(`Message sans utilisateur identifié`);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      this.logger.log(`✏️ ${user.username} est en train d'écrire...`);
      client.broadcast.emit('typing', {
        username: user.username,
      });
    }
  }
}
