export interface ArticleResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isActive: boolean;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface CreateArticleRequest {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  categoryId: number;
  tagIds?: number[];
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface ArticleFilters {
  categoryId?: number;
  categorySlug?: string;
  tagIds?: number[];
  authorId?: number;
  search?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  status?: 'PUBLISHED' | 'DRAFT';
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

export interface ArticleStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  breakingArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}