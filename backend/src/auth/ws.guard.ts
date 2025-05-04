import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const handshakeAuth = client.handshake?.auth as Record<string, unknown>;
    const token =
      typeof handshakeAuth.token === 'string' ? handshakeAuth.token : undefined;

    console.log('👉 [WsGuard] Handshake reçu :', handshakeAuth);
    console.log('👉 [WsGuard] Token extrait :', token);

    if (!token) {
      console.warn(
        '⚠️ [WsGuard] Aucun token fourni dans le handshake WebSocket',
      );
      return false;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: 'supersecret',
      });

      console.log('✅ [WsGuard] Payload JWT décodé :', payload);

      client.data = {
        ...(client.data as Record<string, unknown>),
        user: payload,
      };

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.warn('❌ [WsGuard] Token WebSocket invalide:', errorMessage);
      return false;
    }
  }
}
