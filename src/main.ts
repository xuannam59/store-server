import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configure service
  const configService = app.get(ConfigService);

  // configure global pipes
  app.useGlobalPipes(new ValidationPipe());

  // configure global JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // global interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
