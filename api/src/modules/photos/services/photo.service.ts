import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Photo, PhotoDocument } from '../schemas/photo.schema';
import { CreatePhotoDto } from '../dto/photo.dto';
import { UpdatePhotoDto } from '../dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name)
    private photoModel: Model<PhotoDocument>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photoData = {
      ...createPhotoDto,
      categoryIds: createPhotoDto.categoryIds
        ? createPhotoDto.categoryIds.map((id) => new Types.ObjectId(id))
        : [],
      fileIds: createPhotoDto.fileIds || [],
    };

    const photo = new this.photoModel(photoData);
    return photo.save();
  }

  async findAll(): Promise<Photo[]> {
    return this.photoModel.find().populate('categoryIds').exec();
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photoModel
      .findById(id)
      .populate('categoryIds')
      .exec();
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(
    id: string,
    updatePhotoDto: UpdatePhotoDto,
  ): Promise<Photo> {
    // Check if photo exists
    const photo = await this.photoModel.findById(id).exec();
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    const updateData: any = { ...updatePhotoDto };

    // Convert categoryIds to ObjectId if provided
    if (updatePhotoDto.categoryIds) {
      updateData.categoryIds = updatePhotoDto.categoryIds.map(
        (id) => new Types.ObjectId(id),
      );
    }

    const updatedPhoto = await this.photoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryIds')
      .exec();

    if (!updatedPhoto) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return updatedPhoto;
  }

  async remove(id: string): Promise<void> {
    const photo = await this.photoModel.findById(id).exec();
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    await this.photoModel.findByIdAndDelete(id).exec();
  }
}

