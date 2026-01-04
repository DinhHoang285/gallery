import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty({ message: 'From source is required' })
  fromSource: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true, message: 'Each categoryId must be a valid MongoDB ObjectId' })
  categoryIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  fileIds?: string[];

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isSale?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price?: number;
}

export class UpdatePhotoDto {
  @IsString()
  @IsOptional()
  fromSource?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true, message: 'Each categoryId must be a valid MongoDB ObjectId' })
  categoryIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  fileIds?: string[];

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isSale?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price?: number;
}

