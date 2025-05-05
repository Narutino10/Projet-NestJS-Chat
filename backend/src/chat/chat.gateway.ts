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
import { UseGuards, Logger, OnModuleInit } from '@nestjs/common';
import { WsGuard } from '../auth/ws.guard';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrivateMessageService } from './private-message.service';
import { ReactionService } from './reaction.service';

interface UserPayload {
  id: number;
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
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  private connectedUsers = new Map<string, { username: string; room: string }>();
  private allUsernames: string[] = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly privateMessageService: PrivateMessageService,
    private readonly reactionService: ReactionService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.allUsernames = await this.usersService.findAllUsernames();
    this.logger.log(`✅ Préchargé ${this.allUsernames.length} utilisateurs depuis la base`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Tentative de connexion : ${client.id}`);

    const token = client.handshake?.auth?.token as string | undefined;
    if (!token) {
      this.logger.warn(`❌ Pas de token fourni`);
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify<{
        sub: number;
        email: string;
        username: string;
      }>(token, { secret: 'supersecret' } as JwtVerifyOptions);

      const payload: UserPayload = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
      };

      (client.data as { user?: UserPayload }).user = payload;

      this.connectedUsers.set(client.id, {
        username: payload.username,
        room: '',
      });

      if (!this.allUsernames.includes(payload.username)) {
        this.allUsernames.push(payload.username);
      }

      this.logger.log(`✅ Connecté : ${client.id} (${payload.username})`);
    } catch {
      this.logger.warn(`❌ Token invalide`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const entry = this.connectedUsers.get(client.id);
    if (entry) {
      this.connectedUsers.delete(client.id);
      this.logger.log(`❌ ${entry.username} maintenant offline`);
      this.broadcastUsers(entry.room);
    } else {
      this.logger.warn(`Déconnexion inconnue : ${client.id}`);
    }
  }

  private broadcastUsers(room: string): void {
    const usersInRoom = this.allUsernames.map((username) => {
      const isOnline = Array.from(this.connectedUsers.values()).some(
        (u) => u.username === username && u.room === room,
      );
      return { username, status: isOnline ? 'online' : 'offline' };
    });

    this.logger.log(`📡 Envoi des utilisateurs room "${room}" : ${JSON.stringify(usersInRoom)}`);
    this.server.to(room).emit('users', usersInRoom);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      client.join(data.room);
      const entry = this.connectedUsers.get(client.id);
      if (entry) {
        entry.room = data.room;
        this.connectedUsers.set(client.id, entry);
      }

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
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: IncomingMessage): void {
    const user = (client.data as { user?: UserPayload }).user;
    const entry = this.connectedUsers.get(client.id);

    if (user && user.username && entry) {
      const room = entry.room;
      const messageContent = data.message || '';

      this.logger.log(`💬 [${room}] ${user.username} : ${messageContent}`);

      this.server.to(room).emit('message', {
        sender: user.username,
        message: messageContent,
        color: data.color,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    } else {
      this.logger.warn(`Message sans utilisateur identifié`);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverUsername: string; message: string; color: string },
  ): Promise<void> {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      await this.privateMessageService.saveMessage(user.username, data.receiverUsername, data.message);

      const receiverEntry = Array.from(this.connectedUsers.entries()).find(
        ([, u]) => u.username === data.receiverUsername,
      );

      const payload = {
        sender: user.username,
        message: data.message,
        color: data.color,
        timestamp: new Date().toISOString(),
      };

      if (receiverEntry) {
        const [receiverSocketId] = receiverEntry;
        this.logger.log(`💌 Message privé de ${user.username} à ${data.receiverUsername}: ${data.message}`);

        this.server.to(receiverSocketId).emit('privateMessage', payload);
        client.emit('privateMessage', { ...payload, to: data.receiverUsername });
      } else {
        this.logger.warn(`⚠️ Utilisateur ${data.receiverUsername} introuvable pour DM`);
      }
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getPrivateHistory')
  async handleGetPrivateHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { withUser: string },
  ): Promise<void> {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      const messages = await this.privateMessageService.getHistory(user.username, data.withUser);

      this.logger.log(`📜 Renvoi historique privé entre ${user.username} et ${data.withUser}`);
      client.emit('privateHistory', messages);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      this.logger.log(`✏️ ${user.username} est en train d'écrire dans ${data.room}`);
      client.to(data.room).emit('typing', { username: user.username });
    }
  }


  @SubscribeMessage('addReaction')
async handleAddReaction(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: { messageId: number; emoji: string },
) {
  const user = (client.data as { user?: UserPayload }).user;
  if (!user) return;

  await this.reactionService.addReaction(user.username, data.messageId, data.emoji);

  this.server.emit('reactionAdded', {
    messageId: data.messageId,
    userId: user.id,
    emoji: data.emoji,
  });
}

}
