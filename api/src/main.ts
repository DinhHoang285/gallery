import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  const databaseUrl = configService.get<string>('DATABASE_URL');

  // 1. Thiết lập Prefix cho tất cả các route API
  // app.setGlobalPrefix('api'); // Đã bỏ prefix để dùng trực tiếp http://localhost:4000

  // 2. Cấu hình ValidationPipe nâng cao
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 3. Cấu hình CORS chi tiết hơn
  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-vercel-domain.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Log database connection info (Giữ nguyên phần của bạn)
  if (databaseUrl) {
    console.log(`📦 Database URL: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);
  } else {
    console.warn('⚠️  DATABASE_URL không được cấu hình!');
  }

  await app.listen(port);
  console.log(`🚀 Backend đang chạy tại: http://localhost:${port}`);
  console.log(`🔗 API Endpoint: http://localhost:${port}`);
}
bootstrap();