import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import type { Response } from 'express';
import * as fs from 'fs';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(AdminGuard) // Only admin can upload
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body: any,
    @Request() req: any,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Parse form data fields (multipart/form-data sends everything as strings)
    const name = body.name;
    const description = body.description;
    const fileType = body.fileType;

    // Parse isSale and price from FormData (they come as strings)
    const isSaleStr = body.isSale;
    const priceStr = body.price;

    const isSale = isSaleStr === 'true' || isSaleStr === true || isSaleStr === '1';
    const price = priceStr !== undefined && priceStr !== null && priceStr !== ''
      ? (typeof priceStr === 'string' ? parseFloat(priceStr) : priceStr)
      : undefined;

    const fileRecord = await this.filesService.uploadFile(
      file,
      name,
      description,
      isSale,
      price,
      fileType,
    );

    const fileObj = fileRecord.toObject();

    return {
      message: 'File uploaded successfully',
      file: {
        id: fileObj._id,
        type: fileObj.type,
        name: fileObj.name,
        description: fileObj.description,
        server: fileObj.server,
        path: fileObj.path,
        size: fileObj.size,
        thumbnail: fileObj.thumbnail,
        createdAt: fileObj.createdAt,
      },
    };
  }

  @Get()
  getAllFiles() {
    return this.filesService.getAllFiles();
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.getFileById(id);

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);

    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  }

  @Get(':id/thumbnail')
  async getThumbnail(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.getFileById(id);

    if (!file.thumbnail || !fs.existsSync(file.thumbnail)) {
      return res.status(404).json({ message: 'Thumbnail not found' });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="thumb-${file.name}"`);

    const thumbnailStream = fs.createReadStream(file.thumbnail);
    thumbnailStream.pipe(res);
  }

  @Get(':id/url')
  async getFileUrl(@Param('id') id: string) {
    const url = await this.filesService.getFileUrl(id);
    return { url };
  }

  @Get(':id/thumbnail-url')
  async getThumbnailUrl(@Param('id') id: string) {
    const url = await this.filesService.getThumbnailUrl(id);
    return { url };
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // Only admin can delete
  async deleteFile(@Param('id') id: string) {
    await this.filesService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}

