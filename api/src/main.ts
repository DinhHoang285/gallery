import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  const databaseUrl = configService.get<string>('DATABASE_URL');

  // Log database connection info
  if (databaseUrl) {
    console.log(`📦 Database URL: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);
  } else {
    console.warn('⚠️  DATABASE_URL không được cấu hình!');
  }

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(port);
  console.log(`🚀 Backend đang chạy tại: http://localhost:${port}`);
}
bootstrap();