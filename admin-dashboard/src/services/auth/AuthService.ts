import { ApiService } from '../base/ApiService';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/auth.types';

class AuthService extends ApiService {
  constructor() {
    super();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('/auth/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      // Logout hatası varsa da token'ı temizle
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await this.post<RefreshTokenResponse>('/auth/refresh');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;