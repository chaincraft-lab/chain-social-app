import { ArticleResponseDto } from '../../articles/dto/article-response.dto';

export enum SearchType {
  ARTICLE = 'article',
  USER = 'user',
  CATEGORY = 'category',
  TAG = 'tag',
  ALL = 'all'
}

export enum SearchSortBy {
  RELEVANCE = 'relevance',
  DATE = 'date',
  POPULARITY = 'popularity',
  VIEWS = 'views'
}

export enum SearchSortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface SearchFilters {
  categoryIds?: number[];
  tagIds?: number[];
  authorIds?: number[];
  dateFrom?: Date;
  dateTo?: Date;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface SearchOptions {
  query: string;
  type?: SearchType;
  page?: number;
  limit?: number;
  sortBy?: SearchSortBy;
  sortOrder?: SearchSortOrder;
  filters?: SearchFilters;
  userId?: number; // For personalized results
}

export interface SearchResultItem {
  id: number;
  type: SearchType;
  title: string;
  excerpt?: string;
  image?: string;
  url: string;
  score: number; // Relevance score
  publishedAt?: Date;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  items: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  searchTime: number; // in ms
  suggestions?: string[];
  aggregations?: {
    categories?: Array<{ id: number; name: string; count: number }>;
    tags?: Array<{ id: number; name: string; count: number }>;
    authors?: Array<{ id: number; name: string; count: number }>;
  };
}

export interface SearchableEntity {
  searchFields: string[]; // Fields to search in
  weightedFields?: Record<string, number>; // Field weights for relevance scoring
  filters?: Record<string, any>; // Default filters
}

export interface SearchProvider {
  search(options: SearchOptions): Promise<SearchResult>;
  suggest(query: string, type?: SearchType): Promise<string[]>;
  index(entity: any, type: SearchType): Promise<void>;
  removeFromIndex(id: number, type: SearchType): Promise<void>;
}