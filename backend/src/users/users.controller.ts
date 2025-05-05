import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('update-color')
  updateColor(@Body() body: { email: string; color: string; avatar: string }) {
  return this.usersService.updateColorAndAvatar(body);
  }
}
