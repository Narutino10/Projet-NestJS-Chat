import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
}
bootstrap();
