import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateMessage } from './private-message.entity';

@Injectable()
export class PrivateMessageService {
  constructor(
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepo: Repository<PrivateMessage>,
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
    });
  }
}
