import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request as ExpressRequest } from 'express';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @Request() req,
    @Body() body: { color: string; avatar: string }
  ) {
    return this.usersService.updateColorAndAvatar({
      email: req.user.email,
      color: body.color,
      avatar: body.avatar,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const token = await this.usersService.generateResetToken(email);
    return { resetLink: `http://localhost:3001/reset-password/${token}` };
  }

  @Post('reset-password')
  async sendReset(@Body() body: { email: string }) {
    console.log('📨 Demande de reset reçue pour :', body.email);
    return this.usersService.generateResetToken(body.email);
  }
}
