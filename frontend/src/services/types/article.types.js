// Article types and interfaces

export const ArticleResponse = {
  id: 0,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: null,
  isFeatured: false,
  isBreaking: false,
  isActive: true,
  publishedAt: null,
  createdAt: '',
  updatedAt: '',
  category: null,
  author: null,
  tags: [],
  viewCount: 0,
  likeCount: 0,
  commentCount: 0
};

export const ArticleWithDetails = {
  ...ArticleResponse,
  content: '', // Full content for detail page
  metaTitle: '',
  metaDescription: '',
  relatedArticles: []
};

export const ArticleFilters = {
  page: 1,
  limit: 10,
  categoryId: null,
  categorySlug: '',
  tagIds: [],
  authorId: null,
  search: '',
  isFeatured: null,
  isBreaking: null,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  startDate: '',
  endDate: ''
};

export const ArticleStats = {
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  featuredArticles: 0,
  breakingArticles: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0
};