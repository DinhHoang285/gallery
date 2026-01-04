import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

