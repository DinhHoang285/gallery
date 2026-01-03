import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from '../services/photo.service';
import { CreatePhotoDto } from '../dto/photo.dto';
import { UpdatePhotoDto } from '../dto/photo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('photos')
@UseGuards(JwtAuthGuard) // Require authentication for all routes
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseGuards(AdminGuard) // Only admin can create
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard) // Only admin can update
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photoService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // Only admin can delete
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}

