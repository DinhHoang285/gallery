import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/categorys/category.module';
import { PhotoModule } from './modules/photos/photo.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        console.log(`🔌 Connecting to database: ${databaseUrl?.replace(/\/\/.*@/, '//***:***@') || 'NOT SET'}`);
        return {
          uri: databaseUrl,
        };
      },
    }),
    AuthModule,
    CategoryModule,
    PhotoModule,
    FilesModule,
  ],
})
export class AppModule { }