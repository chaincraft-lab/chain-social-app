import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Response tiplerini tanımlayalım
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  articleCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

class ApiService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - token ekleme
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - hata yönetimi
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Browser'da token'ı localStorage'dan al veya demo token'ı kullan
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token') || process.env.NEXT_PUBLIC_JWT_SECRET;
    }
  }

  // Token yönetimi
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Generic HTTP metodları
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }

  // ================================
  // CATEGORY API METHODS
  // ================================

  // Tüm kategorileri getir (pagination ile)
  async getCategories(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<CategoryResponse>> {
    return this.get(`/categories?page=${page}&limit=${limit}`);
  }

  // Aktif kategorileri getir (pagination yok)
  async getActiveCategories(): Promise<CategoryResponse[]> {
    return this.get('/categories/active');
  }

  // ID ile kategori getir
  async getCategoryById(id: number): Promise<CategoryResponse> {
    return this.get(`/categories/${id}`);
  }

  // Slug ile kategori getir
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    return this.get(`/categories/slug/${slug}`);
  }

  // Yeni kategori oluştur
  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    return this.post('/categories', data);
  }

  // Kategori güncelle
  async updateCategory(
    id: number,
    data: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    return this.patch(`/categories/${id}`, data);
  }

  // Kategori sil
  async deleteCategory(id: number): Promise<{ message: string }> {
    return this.delete(`/categories/${id}`);
  }

  // Kategori aktif/pasif durumunu değiştir
  async toggleCategoryActive(id: number): Promise<CategoryResponse> {
    return this.patch(`/categories/${id}/toggle-active`);
  }

  // ================================
  // AUTH METHODS (gelecekte eklenebilir)
  // ================================

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.post('/auth/refresh');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }
}

// Singleton instance
const apiService = new ApiService();

export default apiService;