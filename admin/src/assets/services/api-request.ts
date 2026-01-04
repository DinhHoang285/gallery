import axios from 'axios';
import cookie from 'js-cookie';

export interface IResponse<T> {
  status: number;
  data: T;
}

export const TOKEN = 'token';

// Hàm kiểm tra URL đơn giản để thay thế cho @lib/string nếu bạn chưa có
const isUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');

export abstract class APIRequest {
  // Ưu tiên dùng biến môi trường của Next.js (bắt buộc có NEXT_PUBLIC_)
  static API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  getBaseApiEndpoint() {
    return APIRequest.API_ENDPOINT;
  }

  async request(
    url: string,
    method: string = 'get',
    body?: any,
    headers?: { [key: string]: string }
  ): Promise<any> {
    const verb = method.toUpperCase();
    const token = cookie.get(TOKEN);

    const updatedHeader = {
      'Content-Type': 'application/json',
      // Thêm Bearer Token chuẩn NestJS Passport JWT
      'Authorization': token ? `Bearer ${token}` : '',
      ...(headers || {})
    };

    const baseApiEndpoint = headers?.baseEndpoint || this.getBaseApiEndpoint();
    const fullUrl = isUrl(url) ? url : `${baseApiEndpoint}${url}`;

    try {
      const resp = await axios({
        url: fullUrl,
        method: verb,
        headers: updatedHeader,
        data: body
      });
      return resp.data;
    } catch (error: any) {
      const { response } = error;

      // Tự động xử lý khi Token hết hạn hoặc không hợp lệ
      if (response && response.status === 401) {
        if (typeof window !== 'undefined') {
          cookie.remove(TOKEN); // Xóa token "lỏ" để tránh loop
          window.location.href = '/login'; // Chuyển về trang login
        }
        throw new Error('Unauthorized or Session Expired');
      }

      // Quăng lỗi từ server về để UI hiển thị (ví dụ: "Email đã tồn tại")
      throw response?.data || { message: 'Can not connect to server!' };
    }
  }

  get(url: string, headers?: { [key: string]: string }) {
    return this.request(url, 'get', null, headers);
  }

  post(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'post', data, headers);
  }

  put(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'put', data, headers);
  }

  del(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'delete', data, headers);
  }

  // Hàm Upload "thần thánh" hỗ trợ theo dõi % tiến trình cho Gallery
  upload(
    url: string,
    files: {
      file: any;
      fieldname: string;
    }[],
    options: {
      onProgress: (data: { percentage: number }) => void;
      customData?: Record<string, any>;
      method?: string;
    } = {
        onProgress() { },
        method: 'POST'
      },
    pauseButton: HTMLButtonElement | null = null
  ): Promise<any> {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    const uploadUrl = isUrl(url) ? url : `${baseApiEndpoint}${url}`;

    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      // Theo dõi % upload
      req.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          options.onProgress({
            percentage: Math.round((event.loaded / event.total) * 100)
          });
        }
      });

      req.addEventListener('load', () => {
        const success = req.status >= 200 && req.status < 300;
        if (!success) {
          return reject(req.response);
        }
        return resolve(req.response);
      });

      req.upload.addEventListener('error', () => {
        reject(new Error('Upload failed!'));
      });

      const formData = new FormData();

      // Đính kèm files
      files.forEach((f) => formData.append(f.fieldname, f.file, f.file.name));

      // Đính kèm dữ liệu phụ (ví dụ: title, description của ảnh)
      if (options.customData) {
        Object.keys(options.customData).forEach((key) => {
          const value = options.customData![key];
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
      }

      req.responseType = 'json';
      req.open(options.method || 'POST', uploadUrl);

      // Thêm token vào header cho upload request
      const token = cookie.get(TOKEN);
      if (token) {
        req.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      req.send(formData);

      if (pauseButton) {
        pauseButton.addEventListener('click', () => {
          req.abort();
          reject(new Error('Upload cancelled by user'));
        });
      }
    });
  }
}

