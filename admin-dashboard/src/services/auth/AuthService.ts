import { ApiService } from '../base/ApiService';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/auth.types';

class AuthService extends ApiService {
  constructor() {
    super();
  }

  async login(credentials: LoginRequest): Promise<any> {
    try {
      const response = await this.post<any>('/auth/login', credentials);
      // API response yapısına göre token'ı al
      const token = response.data?.data?.access_token || response.data?.access_token || response.access_token;
      if (token) {
        this.setToken(token);
      }
      return response;
    } catch (error: any) {
      // Hata nesnesini olduğu gibi fırlat, böylece status code korunur
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Sadece token'ı temizle, API isteği gönderme
    this.clearToken();
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await this.post<RefreshTokenResponse>('/auth/refresh');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;