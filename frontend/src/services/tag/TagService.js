import ApiService from '../base/ApiService';

class TagService extends ApiService {
  constructor() {
    super();
  }

  // Tüm tagları getir
  async getTags(filters = {}) {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 50,
    });

    // Filtreleri params'a ekle
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'limit') {
        params.append(key, value.toString());
      }
    });

    return this.get(`/tags?${params.toString()}`);
  }

  // Popüler tagları getir (en çok kullanılan)
  async getPopularTags(limit = 20) {
    return this.get(`/tags/popular?limit=${limit}`);
  }

  // Tag arama
  async searchTags(query, limit = 10) {
    return this.get(`/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // ID ile tag getir
  async getTagById(id) {
    return this.get(`/tags/${id}`);
  }

  // Slug ile tag getir (makalelerle birlikte)
  async getTagBySlug(slug) {
    return this.get(`/tags/slug/${slug}`);
  }

  // Tag istatistikleri
  async getTagStats() {
    return this.get('/tags/stats');
  }

  // En çok kullanılan tagları getir
  async getTrendingTags(limit = 10) {
    return this.get(`/tags?page=1&limit=${limit}&sortByArticleCount=true`);
  }
}

// Singleton instance
const tagService = new TagService();

export default tagService;