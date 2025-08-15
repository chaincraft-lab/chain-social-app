import { ApiService, PaginatedResponse } from '../base/ApiService';
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category.types';

class CategoryService extends ApiService {
  constructor() {
    super();
  }

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
}

// Singleton instance
const categoryService = new CategoryService();

export default categoryService;