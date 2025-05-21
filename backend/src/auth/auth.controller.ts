import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; username: string },
  ): Promise<{ message: string }> {
    await this.usersService.create(body.email, body.password, body.username);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.authService.login(user);
  }

  @Post('forgot-password')
  async sendResetEmail(@Body('email') email: string) {
    try {
      await this.usersService.generateResetToken(email);
      return { message: 'Email de réinitialisation envoyé' };
    } catch (error) {
      return { error: error.message || 'Erreur inconnue' };
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      await this.usersService.resetPassword(body.token, body.newPassword);
      return { message: 'Mot de passe mis à jour' };
    } catch (error) {
      return { error: error.message || 'Échec de la mise à jour du mot de passe' };
    }
  }
}
