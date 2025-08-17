// Category types and interfaces

export const CategoryResponse = {
  id: 0,
  name: '',
  slug: '',
  description: '',
  color: '',
  icon: '',
  parentId: null,
  isActive: true,
  articlesCount: 0,
  createdAt: '',
  updatedAt: ''
};

export const CategoryWithArticles = {
  ...CategoryResponse,
  articles: [], // Array of ArticleResponse
  subcategories: [] // Array of CategoryResponse (child categories)
};

export const CategoryFilters = {
  page: 1,
  limit: 10,
  search: '',
  parentId: null,
  isActive: null,
  sortBy: 'name',
  sortOrder: 'asc'
};