import { APIRequest } from './api-request';

export interface Photo {
  _id: string;
  fromSource: string;
  categoryIds?: string[];
  fileIds?: string[];
  title?: string;
  description?: string;
  isSale?: boolean;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePhotoDto {
  fromSource: string;
  categoryIds?: string[];
  fileIds?: string[];
  title?: string;
  description?: string;
  isSale?: boolean;
  price?: number;
}

export interface UpdatePhotoDto {
  fromSource?: string;
  categoryIds?: string[];
  fileIds?: string[];
  title?: string;
  description?: string;
  isSale?: boolean;
  price?: number;
}

class PhotoService extends APIRequest {
  async getAll(): Promise<Photo[]> {
    try {
      const response = await this.get('/photos');
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async getById(id: string): Promise<Photo> {
    try {
      const response = await this.get(`/photos/${id}`);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async create(data: CreatePhotoDto): Promise<Photo> {
    try {
      const response = await this.post('/photos', data);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: UpdatePhotoDto): Promise<Photo> {
    try {
      const response = await this.request(`/photos/${id}`, 'PATCH', data);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.del(`/photos/${id}`);
    } catch (error: any) {
      throw error;
    }
  }
}

export const photoService = new PhotoService();

