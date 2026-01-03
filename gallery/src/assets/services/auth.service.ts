import cookie from 'js-cookie';
import { APIRequest, TOKEN } from './api-request';

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  birthdate?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

class AuthService extends APIRequest {

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/register', data) as AuthResponse;
      if (response.token) {
        cookie.set(TOKEN, response.token, { expires: 7 });
      }

      return response;
    } catch (error: any) {
      throw error;
    }
  }


  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/login', data) as AuthResponse;
      console.log('response', response);

      if (response.token) {
        cookie.set(TOKEN, response.token, { expires: 7 });
      }

      return response;
    } catch (error: any) {
      throw error;
    }
  }


  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.post('/auth/logout') as { message: string };
      cookie.remove(TOKEN);

      return response;
    } catch (error: any) {
      cookie.remove(TOKEN);
      throw error;
    }
  }


  async logoutAll(): Promise<{ message: string }> {
    try {
      const response = await this.del('/auth/logout-all') as { message: string };
      cookie.remove(TOKEN);

      return response;
    } catch (error: any) {
      cookie.remove(TOKEN);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!cookie.get(TOKEN);
  }

  getToken(): string | undefined {
    return cookie.get(TOKEN);
  }
}

export const authService = new AuthService();

