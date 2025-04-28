import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import "dotenv/config"
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
