import { APIRequest } from './api-request';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

class CategoryService extends APIRequest {
  async getAll(): Promise<Category[]> {
    try {
      const response = await this.get('/categories');
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async getById(id: string): Promise<Category> {
    try {
      const response = await this.get(`/categories/${id}`);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    try {
      const response = await this.post('/categories', data);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    try {
      const response = await this.request(`/categories/${id}`, 'PATCH', data);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.del(`/categories/${id}`);
    } catch (error: any) {
      throw error;
    }
  }
}

export const categoryService = new CategoryService();

