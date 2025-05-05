import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateMessage } from './private-message.entity';
import { PrivateMessageService } from './private-message.service';
import { PrivateMessageController } from './private-message.controller';
import { Reaction } from './reaction.entity';
import { ReactionService } from './reaction.service';
@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([PrivateMessage, Reaction])],
  providers: [ChatGateway, PrivateMessageService, ReactionService],
  controllers: [PrivateMessageController],
})
export class ChatModule {}
