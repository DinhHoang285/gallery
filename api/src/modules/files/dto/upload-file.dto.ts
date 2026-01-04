import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isSale?: boolean;

  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}

