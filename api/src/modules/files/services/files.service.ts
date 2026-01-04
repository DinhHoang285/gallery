import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');

  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {
    // Ensure upload directories exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.thumbnailDir)) {
      fs.mkdirSync(this.thumbnailDir, { recursive: true });
    }
  }

  async uploadFile(
    file: any,
    name?: string,
    description?: string,
  ): Promise<FileDocument> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.originalname);
      const fileName = `${timestamp}-${randomString}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Generate thumbnail if it's an image
      let thumbnailPath: string | undefined;
      if (file.mimetype.startsWith('image/')) {
        thumbnailPath = await this.generateThumbnail(filePath, fileName);
      }

      // Create file record in database
      const fileRecord = await this.fileModel.create({
        type: file.mimetype,
        name: name || file.originalname,
        description: description,
        server: 'diskStorage',
        path: filePath,
        size: file.size,
        thumbnail: thumbnailPath,
        originalName: file.originalname,
      });

      return fileRecord;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  private async generateThumbnail(
    originalPath: string,
    originalFileName: string,
  ): Promise<string | undefined> {
    try {
      // Dynamic import to handle case when sharp is not installed
      const sharp = await import('sharp');

      const thumbnailFileName = `thumb-${originalFileName}`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailFileName);

      // Generate thumbnail with sharp (300x300, maintain aspect ratio)
      await sharp.default(originalPath)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      // Don't throw error, just return undefined if thumbnail generation fails
      return undefined;
    }
  }

  async getFileById(id: string): Promise<FileDocument> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new BadRequestException(`File with ID ${id} not found`);
    }
    return file;
  }

  async getAllFiles(): Promise<FileDocument[]> {
    return this.fileModel.find().exec();
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.getFileById(id);

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete thumbnail if exists
    if (file.thumbnail && fs.existsSync(file.thumbnail)) {
      fs.unlinkSync(file.thumbnail);
    }

    // Delete record from database
    await this.fileModel.findByIdAndDelete(id).exec();
  }

  async getFileUrl(id: string): Promise<string> {
    const file = await this.getFileById(id);
    // Return relative path or full URL based on your setup
    return `/files/${id}`;
  }

  async getThumbnailUrl(id: string): Promise<string | null> {
    const file = await this.getFileById(id);
    if (!file.thumbnail) {
      return null;
    }
    return `/files/${id}/thumbnail`;
  }
}

