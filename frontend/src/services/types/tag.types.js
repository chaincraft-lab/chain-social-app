// Tag types and interfaces

export const TagResponse = {
  id: 0,
  name: '',
  slug: '',
  articlesCount: 0,
  createdAt: '',
  updatedAt: ''
};

export const TagWithArticles = {
  ...TagResponse,
  articles: [] // Array of ArticleResponse
};

export const TagFilters = {
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  sortByArticleCount: false
};