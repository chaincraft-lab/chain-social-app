import ApiService from '../base/ApiService';

class CategoryService extends ApiService {
  constructor() {
    super();
  }

  // Tüm kategorileri getir (pagination ile)
  async getCategories(filters = {}) {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 50
    });

    return this.get(`/categories?${params.toString()}`);
  }

  // Aktif kategorileri getir (navigation için) - pagination yok
  async getActiveCategories() {
    return this.get('/categories/active');
  }

  // Popüler kategorileri getir (en çok makalesi olan) - backend'de böyle endpoint yok, active'den alıp article count'a göre sırala
  async getPopularCategories(limit = 10) {
    const response = await this.get('/categories/active');
    const categories = response.data || response;
    // Article count'a göre sırala ve limit uygula
    return categories
      .sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0))
      .slice(0, limit);
  }

  // Ana kategorileri getir (parent kategoriler) - aktif kategorilerden filtrele
  async getParentCategories() {
    const response = await this.get('/categories/active');
    const categories = response.data || response;
    // Parent kategorileri filtrele (parentId null olanlar)
    return categories.filter(cat => !cat.parentId);
  }

  // Alt kategorileri getir
  async getSubCategories(parentId) {
    const response = await this.get('/categories/active');
    const categories = response.data || response;
    // Alt kategorileri filtrele (belirtilen parentId'ye sahip olanlar)
    return categories.filter(cat => cat.parentId === parentId);
  }

  // ID ile kategori getir
  async getCategoryById(id) {
    return this.get(`/categories/${id}`);
  }

  // Slug ile kategori getir
  async getCategoryBySlug(slug) {
    return this.get(`/categories/slug/${slug}`);
  }

  // Kategori arama - backend'de search endpoint yok, active kategorilerde arama yap
  async searchCategories(query, limit = 10) {
    const response = await this.get('/categories/active');
    const categories = response.data || response;
    // Name ve description'da arama yap
    const filtered = categories.filter(cat => 
      cat.name?.toLowerCase().includes(query.toLowerCase()) ||
      cat.description?.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.slice(0, limit);
  }
}

// Singleton instance
const categoryService = new CategoryService();

export default categoryService;