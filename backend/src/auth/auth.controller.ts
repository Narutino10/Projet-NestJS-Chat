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
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string }> {
    await this.usersService.create(body.email, body.password);
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
}
