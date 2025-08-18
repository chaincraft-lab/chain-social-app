import ApiService from '../base/ApiService';

class ArticleService extends ApiService {
  constructor() {
    super();
  }

  // Tüm makaleleri getir (published only - frontend için)
  async getArticles(filters = {}) {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
    });

    // Filtreleri params'a ekle
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'limit') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return this.get(`/articles?${params.toString()}`);
  }

  // Öne çıkan makaleleri getir
  async getFeaturedArticles(limit = 5) {
    return this.get(`/articles/featured?page=1&limit=${limit}&sortBy=publishedAt&sortOrder=desc`);
  }

  // Son dakika haberlerini getir
  async getBreakingArticles(limit = 3) {
    return this.get(`/articles/breaking?page=1&limit=${limit}&sortBy=publishedAt&sortOrder=desc`);
  }

  // Popüler makaleleri getir (en çok görüntülenen)
  async getPopularArticles(limit = 5) {
    return this.get(`/articles?limit=${limit}&sortBy=views&sortOrder=desc`);
  }

  // En son makaleleri getir
  async getLatestArticles(limit = 10) {
    return this.get(`/articles?limit=${limit}&sortBy=publishedAt&sortOrder=desc`);
  }

  // Makale detayını getir
  async getArticleBySlug(slug) {
    return this.get(`/articles/slug/${slug}`);
  }

  // ID ile makale getir
  async getArticleById(id) {
    return this.get(`/articles/${id}`);
  }

  // Kategoriye göre makaleleri getir
  async getArticlesByCategory(categorySlug, filters = {}) {
    const params = new URLSearchParams({
      categorySlug,
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'publishedAt',
      sortOrder: filters.sortOrder || 'desc'
    });

    // Diğer filtreleri ekle
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && 
          !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
        params.append(key, value.toString());
      }
    });

    return this.get(`/articles?${params.toString()}`);
  }

  // Etikete göre makaleleri getir
  async getArticlesByTag(tagSlug, filters = {}) {
    const params = new URLSearchParams({
      tagSlug,
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'publishedAt',
      sortOrder: filters.sortOrder || 'desc'
    });

    // Diğer filtreleri ekle
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && 
          !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
        params.append(key, value.toString());
      }
    });

    return this.get(`/articles?${params.toString()}`);
  }

  // Yazara göre makaleleri getir
  async getArticlesByAuthor(authorId, filters = {}) {
    const params = new URLSearchParams({
      authorId,
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'publishedAt',
      sortOrder: filters.sortOrder || 'desc'
    });

    return this.get(`/articles?${params.toString()}`);
  }

  // Makale arama
  async searchArticles(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'publishedAt',
      sortOrder: filters.sortOrder || 'desc'
    });

    // Diğer filtreleri ekle
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && 
          !['page', 'limit', 'sortBy', 'sortOrder', 'search'].includes(key)) {
        params.append(key, value.toString());
      }
    });

    return this.get(`/articles?${params.toString()}`);
  }

  // İlgili makaleleri getir
  async getRelatedArticles(articleId, limit = 5) {
    return this.get(`/articles/${articleId}/related?limit=${limit}`);
  }

  // Makale görüntüleme sayısını artır - backend'de böyle endpoint yok görünüyor
  async incrementViewCount() {
    // Bu fonksiyon şimdilik boş, backend endpoint'i yoksa makale detay çağrısında otomatik artıyor olabilir
    return Promise.resolve();
  }
}

// Singleton instance
const articleService = new ArticleService();

export default articleService;