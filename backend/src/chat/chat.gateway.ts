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

  // Retient tous les utilisateurs connus
  private allUsers = new Map<
    string,
    { username: string; status: string; room: string }
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

      // Vérifie si déjà existant (par username) et supprime ancien ID
      const existingEntry = Array.from(this.allUsers.entries()).find(
        ([, u]) => u.username === payload.username,
      );
      if (existingEntry) {
        const [oldId, oldData] = existingEntry;
        this.allUsers.delete(oldId);
        this.allUsers.set(client.id, {
          ...oldData,
          status: 'online',
        });
      } else {
        this.allUsers.set(client.id, {
          username: payload.username,
          status: 'online',
          room: '',
        });
      }

      this.logger.log(`✅ Connecté : ${client.id} (${payload.username})`);
    } catch {
      this.logger.warn(`❌ Token invalide`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const entry = this.allUsers.get(client.id);
    if (entry) {
      entry.status = 'offline';
      this.allUsers.set(client.id, entry);
      this.logger.log(`❌ ${entry.username} maintenant offline`);
      this.broadcastUsers(entry.room);
    } else {
      this.logger.warn(`Déconnexion inconnue : ${client.id}`);
    }
  }

  private broadcastUsers(room: string): void {
    const usersInRoom = Array.from(this.allUsers.values())
      .filter((u) => u.room === room)
      .map((u) => ({
        username: u.username,
        status: u.status,
      }));

    this.logger.log(
      `📡 Envoi des utilisateurs room "${room}" : ${JSON.stringify(
        usersInRoom,
      )}`,
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
      const entry = this.allUsers.get(client.id);
      if (entry) {
        entry.room = data.room;
        entry.status = 'online';
        this.allUsers.set(client.id, entry);
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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IncomingMessage,
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    const entry = this.allUsers.get(client.id);

    if (user && user.username && entry) {
      const room = entry.room;
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
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { receiverUsername: string; message: string; color: string },
  ): void {
    const user = (client.data as { user?: UserPayload }).user;
    if (user && user.username) {
      const receiverEntry = Array.from(this.allUsers.entries()).find(
        ([, u]) => u.username === data.receiverUsername,
      );

      if (receiverEntry) {
        const [receiverSocketId] = receiverEntry;
        this.logger.log(
          `💌 Message privé de ${user.username} à ${data.receiverUsername}: ${data.message}`,
        );

        this.server.to(receiverSocketId).emit('privateMessage', {
          sender: user.username,
          message: data.message,
          color: data.color,
          timestamp: new Date().toISOString(),
        });

        client.emit('privateMessage', {
          sender: user.username,
          message: data.message,
          color: data.color,
          timestamp: new Date().toISOString(),
          to: data.receiverUsername,
        });
      } else {
        this.logger.warn(
          `⚠️ Utilisateur ${data.receiverUsername} introuvable pour DM`,
        );
      }
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
