import { ApiService, PaginatedResponse } from '../base/ApiService';
import { 
  TagResponse, 
  TagWithArticles,
  CreateTagRequest, 
  UpdateTagRequest, 
  TagFilters,
  TagStats 
} from '../types/tag.types';

class TagService extends ApiService {
  constructor() {
    super();
  }

  // Tüm tagları getir (pagination ve filtreleme ile)
  async getTags(
    page: number = 1,
    limit: number = 10,
    filters?: TagFilters
  ): Promise<PaginatedResponse<TagResponse>> {
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

    return this.get(`/tags?${params.toString()}`);
  }

  // Popüler tagları getir
  async getPopularTags(limit: number = 10): Promise<TagResponse[]> {
    return this.get(`/tags/popular?limit=${limit}`);
  }

  // Tag arama
  async searchTags(query: string, limit: number = 10): Promise<TagResponse[]> {
    return this.get(`/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Tag istatistikleri
  async getTagStats(): Promise<TagStats> {
    return this.get('/tags/stats');
  }

  // ID ile tag getir
  async getTagById(id: number): Promise<TagResponse> {
    return this.get(`/tags/${id}`);
  }

  // Slug ile tag getir (makalelerle birlikte)
  async getTagBySlug(slug: string): Promise<TagWithArticles> {
    return this.get(`/tags/slug/${slug}`);
  }

  // Yeni tag oluştur
  async createTag(data: CreateTagRequest): Promise<TagResponse> {
    return this.post('/tags', data);
  }

  // Tag güncelle
  async updateTag(
    id: number,
    data: UpdateTagRequest
  ): Promise<TagResponse> {
    return this.patch(`/tags/${id}`, data);
  }

  // Tag sil
  async deleteTag(id: number): Promise<{ message: string }> {
    return this.delete(`/tags/${id}`);
  }

  // Çoklu tag silme
  async bulkDeleteTags(ids: number[]): Promise<{
    deletedCount: number;
    failedIds: number[];
    message: string;
  }> {
    return this.post('/tags/bulk-delete', { ids });
  }
}

// Singleton instance
const tagService = new TagService();

export default tagService;