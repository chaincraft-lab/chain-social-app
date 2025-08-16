import { ApiService, PaginatedResponse } from '../base/ApiService';
import { 
  ArticleResponse, 
  CreateArticleRequest, 
  UpdateArticleRequest, 
  ArticleFilters,
  ArticleStats 
} from '../types/article.types';

class ArticleService extends ApiService {
  constructor() {
    super();
  }

  // Tüm makaleleri getir (pagination ve filtreleme ile)
  async getArticles(
    page: number = 1,
    limit: number = 10,
    filters?: ArticleFilters
  ): Promise<PaginatedResponse<ArticleResponse>> {
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

    return this.get(`/articles?${params.toString()}`);
  }

  // Admin için tüm makaleleri getir (aktif + pasif)
  async getArticlesForAdmin(
    page: number = 1,
    limit: number = 10,
    filters?: ArticleFilters
  ): Promise<PaginatedResponse<ArticleResponse>> {
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

    return this.get(`/articles/admin?${params.toString()}`);
  }

  // Öne çıkan makaleleri getir
  async getFeaturedArticles(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ArticleResponse>> {
    return this.get(`/articles/featured?page=${page}&limit=${limit}`);
  }

  // Son dakika haberlerini getir
  async getBreakingArticles(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ArticleResponse>> {
    return this.get(`/articles/breaking?page=${page}&limit=${limit}`);
  }

  // ID ile makale getir
  async getArticleById(id: number): Promise<ArticleResponse> {
    return this.get(`/articles/${id}`);
  }

  // Slug ile makale getir
  async getArticleBySlug(slug: string): Promise<ArticleResponse> {
    return this.get(`/articles/slug/${slug}`);
  }

  // Kategoriye göre makaleler
  async getArticlesByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ArticleResponse>> {
    return this.get(`/articles/category/${categoryId}?page=${page}&limit=${limit}`);
  }

  // Yazara göre makaleler
  async getArticlesByAuthor(
    authorId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ArticleResponse>> {
    return this.get(`/articles/author/${authorId}?page=${page}&limit=${limit}`);
  }

  // Yeni makale oluştur
  async createArticle(data: CreateArticleRequest): Promise<ArticleResponse> {
    return this.post('/articles', data);
  }

  // Makale güncelle
  async updateArticle(
    id: number,
    data: UpdateArticleRequest
  ): Promise<ArticleResponse> {
    return this.patch(`/articles/${id}`, data);
  }

  // Makale sil
  async deleteArticle(id: number): Promise<{ message: string }> {
    return this.delete(`/articles/${id}`);
  }

  // Makale aktiflik durumunu değiştir
  async toggleArticleActive(id: number): Promise<ArticleResponse> {
    return this.patch(`/articles/${id}/toggle-active`);
  }

  // Makale beğen/beğenmeme
  async toggleArticleLike(id: number): Promise<{ liked: boolean; likeCount: number }> {
    return this.post(`/articles/${id}/like`);
  }

  // Makale görüntüleme sayısını artır
  async incrementViewCount(id: number): Promise<{ viewCount: number }> {
    return this.post(`/articles/${id}/view`);
  }

  // Makale istatistikleri
  async getArticleStats(): Promise<ArticleStats> {
    return this.get('/articles/stats');
  }

  // İlgili makaleleri getir
  async getRelatedArticles(id: number, limit: number = 5): Promise<ArticleResponse[]> {
    return this.get(`/articles/${id}/related?limit=${limit}`);
  }

  // Dosya yükleme (featured image için)
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.post('/articles/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Toplu işlemler - Backend'de mevcut olmadığı için kaldırıldı
  // async bulkDelete(ids: number[]): Promise<{ deletedCount: number }> {
  //   return this.post('/articles/bulk-delete', { ids });
  // }
}

// Singleton instance
const articleService = new ArticleService();

export default articleService;