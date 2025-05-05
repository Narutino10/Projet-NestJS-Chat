import { Controller, Get, Query } from '@nestjs/common';
import { PrivateMessageService } from './private-message.service';

@Controller('private-messages')
export class PrivateMessageController {
  constructor(private readonly privateMessageService: PrivateMessageService) {}

  @Get('history')
  async getHistory(@Query('userA') userA: string, @Query('userB') userB: string) {
    return this.privateMessageService.getHistory(userA, userB);
  }
}
