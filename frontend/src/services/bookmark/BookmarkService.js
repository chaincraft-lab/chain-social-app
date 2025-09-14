import ApiService from '../base/ApiService';

class BookmarkService extends ApiService {
  constructor() {
    super();
  }

  // Makale kaydet/kaydetme (toggle)
  async toggleBookmark(articleId) {
    return this.post('/bookmarks/toggle', { articleId });
  }

  // Makale bookmark durumunu kontrol et
  async isBookmarked(articleId) {
    return this.get(`/bookmarks/article/${articleId}/check`);
  }

  // Kullanıcının kaydettiği makaleler
  async getMyBookmarks(filters = {}) {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc'
    });
    
    return this.get(`/bookmarks/my-bookmarks?${params.toString()}`);
  }

  // En çok kaydedilen makaleler
  async getMostBookmarkedArticles(limit = 10) {
    return this.get(`/bookmarks/most-bookmarked?limit=${limit}`);
  }

  // Bookmark'ı kaldır
  async removeBookmark(articleId) {
    return this.delete(`/bookmarks/article/${articleId}`);
  }
}

// Singleton instance
const bookmarkService = new BookmarkService();

export default bookmarkService;