import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateMessage } from './private-message.entity';
import { Reaction } from './reaction.entity'; // Assure-toi d’avoir créé cette entité Reaction

@Injectable()
export class PrivateMessageService {
  constructor(
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepo: Repository<PrivateMessage>,

    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
  ) {}

  async saveMessage(sender: string, receiver: string, message: string): Promise<PrivateMessage> {
    const newMessage = this.privateMessageRepo.create({ sender, receiver, message });
    return this.privateMessageRepo.save(newMessage);
  }

  async getHistory(userA: string, userB: string): Promise<PrivateMessage[]> {
    return this.privateMessageRepo.find({
      where: [
        { sender: userA, receiver: userB },
        { sender: userB, receiver: userA },
      ],
      order: { timestamp: 'ASC' },
      relations: ['reactions'], // charge les réactions liées au message
    });
  }

  async addReaction(username: string, messageId: number, emoji: string): Promise<Reaction> {
    const message = await this.privateMessageRepo.findOne({
      where: { id: messageId },
      relations: ['reactions'],
    });

    if (!message) {
      throw new Error('Message not found');
    }

    let reaction = message.reactions.find((r) => r.emoji === emoji);
    if (reaction) {
      reaction.count += 1;
    } else {
      reaction = this.reactionRepo.create({
        emoji,
        count: 1,
        message,
        username,
      });
      message.reactions.push(reaction);
    }

    await this.reactionRepo.save(reaction);
    return reaction;
  }
}
