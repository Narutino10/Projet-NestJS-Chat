import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { sub } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        color: user.color,
        avatar: user.avatar,
      };
    }
    return null;
  }

  login(user: Omit<User, 'password'>): { access_token: string } {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      color: user.color,
      avatar: user.avatar,

    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  generateToken(user: Omit<User, 'password'>): string {
  return this.jwtService.sign({
    sub: user.id,
    email: user.email,
    username: user.username,
    color: user.color,
    avatar: user.avatar,
  });
  }
}