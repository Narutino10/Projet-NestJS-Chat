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

    if (!token) {
      console.warn('No token provided in WebSocket handshake');
      return false;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token);
      client.data = {
        ...(client.data as Record<string, unknown>),
        user: payload,
      };
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.warn('Invalid WebSocket token:', errorMessage);
      return false;
    }
  }
}
