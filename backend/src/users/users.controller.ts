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

@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  const token = await this.usersService.generateResetToken(email);
  // Pour l’instant : retourne simplement le token (plus tard on peut envoyer un email)
  return { resetLink: `http://localhost:3001/reset-password/${token}` };
}

  @Post('reset-password')
  async sendReset(@Body() body: { email: string }) {
    console.log('📨 Demande de reset reçue pour :', body.email);
    return this.usersService.generateResetToken(body.email);
  }


}
