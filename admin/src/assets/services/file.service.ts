import { APIRequest } from './api-request';

export interface File {
  _id: string;
  type: string;
  name: string;
  description?: string;
  server: string;
  path: string;
  size: number;
  thumbnail?: string;
  originalName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadFileDto {
  name?: string;
  description?: string;
  isSale?: boolean;
  price?: number;
}

export interface UploadFileResponse {
  message: string;
  file: {
    id: string;
    type: string;
    name: string;
    description?: string;
    server: string;
    path: string;
    size: number;
    thumbnail?: string;
    createdAt: string;
  };
}

class FileService extends APIRequest {
  async uploadFile(
    file: File | Blob,
    name?: string,
    description?: string,
    isSale?: boolean,
    price?: number,
  ): Promise<UploadFileResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) {
        formData.append('name', name);
      }
      if (description) {
        formData.append('description', description);
      }
      // Always append isSale and price (even if false or 0)
      formData.append('isSale', (isSale === true).toString());
      formData.append('price', (price !== undefined ? price : 0).toString());

      const baseApiEndpoint = this.getBaseApiEndpoint();
      const token = this.getToken();

      const response = await fetch(`${baseApiEndpoint}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  async getAll(): Promise<File[]> {
    try {
      const response = await this.get('/files');
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async getById(id: string): Promise<File> {
    try {
      const response = await this.get(`/files/${id}`);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.del(`/files/${id}`);
    } catch (error: any) {
      throw error;
    }
  }

  getFileUrl(id: string): string {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return `${baseApiEndpoint}/files/${id}`;
  }

  getThumbnailUrl(id: string): string {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return `${baseApiEndpoint}/files/${id}/thumbnail`;
  }

  private getToken(): string | undefined {
    // Import cookie dynamically to avoid SSR issues
    if (typeof window === 'undefined') return undefined;
    const cookie = require('js-cookie');
    return cookie.get('token');
  }
}

export const fileService = new FileService();

