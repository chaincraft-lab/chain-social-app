import ApiService from '../base/ApiService';

class LikeService extends ApiService {
  constructor() {
    super();
  }

  // Makale beğen/beğenme (toggle)
  async toggleLike(articleId) {
    return this.post('/likes/toggle', { articleId });
  }

  // Makale beğeni istatistikleri
  async getArticleLikeStats(articleId) {
    return this.get(`/likes/article/${articleId}/stats`);
  }

  // Kullanıcının beğendikleri
  async getMyLikes(filters = {}) {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc'
    });
    
    return this.get(`/likes/my-likes?${params.toString()}`);
  }

  // En çok beğenilen makaleler
  async getTopLikedArticles(limit = 10) {
    return this.get(`/likes/top-articles?limit=${limit}`);
  }

  // Beğeniyi kaldır
  async removeLike(articleId) {
    return this.delete(`/likes/article/${articleId}`);
  }
}

// Singleton instance
const likeService = new LikeService();

export default likeService;