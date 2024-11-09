import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configure service
  const configService = app.get(ConfigService);

  // configure pipes
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
