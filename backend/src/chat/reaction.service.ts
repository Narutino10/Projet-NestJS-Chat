import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { PrivateMessage } from './private-message.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
    @InjectRepository(PrivateMessage)
    private readonly messageRepo: Repository<PrivateMessage>,
  ) {}

  async addReaction(username: string, messageId: number, emoji: string): Promise<Reaction> {
    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new Error('Message not found');

    const reaction = this.reactionRepo.create({
      username,
      emoji,
      message,
    });

    return this.reactionRepo.save(reaction);
  }

  async getReactions(messageId: number): Promise<Reaction[]> {
    return this.reactionRepo.find({
      where: { message: { id: messageId } },
    });
  }
}
