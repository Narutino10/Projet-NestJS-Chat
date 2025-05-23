import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, MailerService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
