import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) throw new Error('Cet email est déjà utilisé.');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async findAllUsernames(): Promise<string[]> {
    const users = await this.usersRepository.find({ select: ['username'] });
    return users.map((u) => u.username);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateColorAndAvatar(body: { email: string; color: string; avatar: string }) {
    const user = await this.usersRepository.findOne({
      where: { email: body.email },
    });
    if (!user) throw new Error('User not found');

    user.color = body.color;
    user.avatar = body.avatar;

    return this.usersRepository.save(user);
  }

  async generateResetToken(email: string): Promise<string> {
  const user = await this.usersRepository.findOne({ where: { email } });
  if (!user) throw new Error('User not found'); // 🔴 ICI ça échoue probablement

  const token = randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = addMinutes(new Date(), 15);
  await this.usersRepository.save(user);

  await this.mailerService.sendPasswordReset(email, token);
  return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
  console.log('🔑 Token reçu pour reset:', token);

  const user = await this.usersRepository.findOne({ where: { resetToken: token } });

  if (!user) {
    console.log('❌ Aucun utilisateur trouvé avec ce token');
    throw new Error('Token invalide ou expiré');
  }

  console.log('👤 Utilisateur trouvé:', user.email);
  console.log('⏰ Expiration:', user.resetTokenExpires);
  console.log('🕒 Now:', new Date());

  if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    console.log('❌ Token expiré');
    throw new Error('Token invalide ou expiré');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await this.usersRepository.save(user);
  console.log('✅ Mot de passe réinitialisé pour', user.email);
  }
}
