import { ApiService, PaginatedResponse } from '../base/ApiService';
import { 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  AdminUpdateUserRequest,
  ChangePasswordRequest,
  UserFilters,
  UserStats 
} from '../types/user.types';

class UserService extends ApiService {
  constructor() {
    super();
  }

  // Tüm kullanıcıları getir (pagination ve filtreleme ile)
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<UserResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    return this.get(`/users?${params.toString()}`);
  }

  // ID ile kullanıcı getir
  async getUserById(id: number): Promise<UserResponse> {
    return this.get(`/users/${id}`);
  }

  // UUID ile kullanıcı getir
  async getUserByUuid(uuid: string): Promise<UserResponse> {
    return this.get(`/users/uuid/${uuid}`);
  }

  // Kullanıcı profili getir
  async getProfile(): Promise<UserResponse> {
    return this.get(`/users/profile`);
  }

  // Kullanıcı istatistikleri getir
  async getUserStats(id: number): Promise<UserStats> {
    return this.get(`/users/${id}/stats`);
  }

  // Yeni kullanıcı oluştur
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return this.post('/users', data);
  }

  // Kullanıcı güncelle (Admin)
  async updateUser(
    id: number,
    data: AdminUpdateUserRequest
  ): Promise<UserResponse> {
    return this.patch(`/users/${id}`, data);
  }

  // Profil güncelle
  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    return this.patch(`/users/profile`, data);
  }

  // Şifre değiştir
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.patch('/users/change-password', data);
  }

  // Kullanıcı blokla/blokunu kaldır
  async toggleUserBlock(id: number): Promise<UserResponse> {
    return this.patch(`/users/${id}/block`);
  }

  // Kullanıcı sil
  async deleteUser(id: number): Promise<{ message: string }> {
    return this.delete(`/users/${id}`);
  }
}

// Singleton instance
const userService = new UserService();

export default userService;