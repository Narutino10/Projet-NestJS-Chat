import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { WsGuard } from '../auth/ws.guard';

@Module({
  imports: [AuthModule],
  providers: [ChatGateway, WsGuard],
})
export class ChatModule {}
