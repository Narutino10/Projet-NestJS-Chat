import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'chatuser',
      password: 'chatpassword',
      database: 'chatdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
