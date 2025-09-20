import ApiService from '../base/ApiService';

class SearchService extends ApiService {
  constructor() {
    super();
  }

  // Ana arama fonksiyonu
  async search(options = {}) {
    const {
      query,
      type = 'all',
      page = 1,
      limit = 10,
      sortBy = 'relevance',
      sortOrder = 'desc',
      filters = {}
    } = options;

    const params = new URLSearchParams({
      query: query.trim(),
      type,
      page,
      limit,
      sortBy,
      sortOrder
    });

    // Filtreleri ekle
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      params.append('categoryIds', filters.categoryIds.join(','));
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      params.append('tagIds', filters.tagIds.join(','));
    }

    if (filters.authorIds && filters.authorIds.length > 0) {
      params.append('authorIds', filters.authorIds.join(','));
    }

    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }

    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }

    if (typeof filters.isFeatured === 'boolean') {
      params.append('isFeatured', filters.isFeatured);
    }

    if (typeof filters.isBreaking === 'boolean') {
      params.append('isBreaking', filters.isBreaking);
    }

    return this.get(`/search?${params.toString()}`);
  }

  // Arama önerileri
  async getSuggestions(query, type = 'all') {
    const params = new URLSearchParams({
      query: query.trim(),
      type
    });

    return this.get(`/search/suggestions?${params.toString()}`);
  }

  // Otomatik tamamlama
  async getAutocomplete(query, type = 'all') {
    const params = new URLSearchParams({
      q: query.trim(),
      type
    });

    return this.get(`/search/autocomplete?${params.toString()}`);
  }

  // Popüler arama terimleri
  async getPopularSearchTerms(limit = 10) {
    return this.get(`/search/popular?limit=${limit}`);
  }

  // Son aramalar (gelecekte implement edilecek)
  async getRecentSearches() {
    return this.get('/search/recent');
  }

  // Hızlı arama (sadece makale başlıkları)
  async quickSearch(query, limit = 5) {
    return this.search({
      query,
      type: 'article',
      limit,
      sortBy: 'relevance'
    });
  }

  // Gelişmiş arama
  async advancedSearch({
    query,
    categories = [],
    tags = [],
    authors = [],
    dateRange = null,
    dateFrom = null,
    dateTo = null,
    isFeatured = null,
    isBreaking = null,
    sortBy = 'relevance',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  }) {
    const filters = {};

    if (categories.length > 0) {
      filters.categoryIds = categories;
    }

    if (tags.length > 0) {
      filters.tagIds = tags;
    }

    if (authors.length > 0) {
      filters.authorIds = authors;
    }

    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }

    if (dateTo) {
      filters.dateTo = dateTo;
    }

    if (typeof isFeatured === 'boolean') {
      filters.isFeatured = isFeatured;
    }

    if (typeof isBreaking === 'boolean') {
      filters.isBreaking = isBreaking;
    }

    return this.search({
      query,
      type: 'article',
      page,
      limit,
      sortBy,
      sortOrder,
      filters
    });
  }
}

// Singleton instance
const searchService = new SearchService();

export default searchService;