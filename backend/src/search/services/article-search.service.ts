import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { 
  SearchOptions, 
  SearchResult, 
  SearchResultItem, 
  SearchType,
  SearchSortBy 
} from '../interfaces/search.interface';
import { ArticleStatus, CommentStatus } from '@prisma/client';

@Injectable()
export class ArticleSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(options: SearchOptions): Promise<SearchResult> {
    const {
      query,
      page = 1,
      limit = 10,
      sortBy = SearchSortBy.RELEVANCE,
      sortOrder = 'desc',
      filters = {},
      userId
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause with advanced search
    const where = this.buildWhereClause(query, filters);
    
    // Build order clause
    const orderBy = this.buildOrderClause(sortBy, sortOrder, query);

    // Execute search query with aggregations
    const [articles, total, aggregations] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true,
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              surname: true,
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
            }
          },
          _count: {
            select: {
              articleLikes: true,
              comments: { where: { status: CommentStatus.APPROVED } },
              bookmarks: true,
            }
          },
          ...(userId ? {
            articleLikes: {
              where: { userId },
              select: { id: true }
            },
            bookmarks: {
              where: { userId },
              select: { id: true }
            }
          } : {})
        }
      }),
      this.prisma.article.count({ where }),
      this.getSearchAggregations(where)
    ]);

    // Calculate relevance scores and format results
    const items = articles.map(article => {
      const score = this.calculateRelevanceScore(article, query);
      return this.formatSearchResult(article, score, userId);
    });

    // Sort by relevance if requested
    if (sortBy === SearchSortBy.RELEVANCE) {
      items.sort((a, b) => sortOrder === 'desc' ? b.score - a.score : a.score - b.score);
    }

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
      searchTime: 0, // Will be set by main search service
      aggregations
    };
  }

  private buildWhereClause(query: string, filters: any): any {
    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    // Text search with enhanced matching
    if (query && query.trim()) {
      const searchTerms = this.extractSearchTerms(query);
      const searchConditions = this.buildSearchConditions(searchTerms);
      where.OR = searchConditions;
    }

    // Apply filters
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categoryId = { in: filters.categoryIds };
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: filters.tagIds }
        }
      };
    }

    if (filters.authorIds && filters.authorIds.length > 0) {
      where.authorId = { in: filters.authorIds };
    }

    if (filters.dateFrom) {
      where.publishedAt = { 
        ...where.publishedAt, 
        gte: new Date(filters.dateFrom) 
      };
    }

    if (filters.dateTo) {
      where.publishedAt = { 
        ...where.publishedAt, 
        lte: new Date(filters.dateTo) 
      };
    }

    if (typeof filters.isFeatured === 'boolean') {
      where.isFeatured = filters.isFeatured;
    }

    if (typeof filters.isBreaking === 'boolean') {
      where.isBreaking = filters.isBreaking;
    }

    return where;
  }

  private extractSearchTerms(query: string): string[] {
    // Split by spaces, remove empty strings, and handle quoted phrases
    const terms: string[] = [];
    const quotedPattern = /"([^"]+)"/g;
    let match;
    
    // Extract quoted phrases
    while ((match = quotedPattern.exec(query)) !== null) {
      terms.push(match[1]);
      query = query.replace(match[0], '');
    }
    
    // Extract remaining words
    const words = query.split(/\s+/).filter(word => word.trim().length > 0);
    terms.push(...words);
    
    return terms.filter(term => term.length >= 2); // Filter out single characters
  }

  private buildSearchConditions(searchTerms: string[]): any[] {
    const conditions: any[] = [];

    searchTerms.forEach(term => {
      // Title search (highest priority)
      conditions.push({
        title: { contains: term, mode: 'insensitive' }
      });

      // Excerpt search (medium priority)
      conditions.push({
        excerpt: { contains: term, mode: 'insensitive' }
      });

      // Content search (lower priority)
      conditions.push({
        content: { contains: term, mode: 'insensitive' }
      });

      // Category name search
      conditions.push({
        category: {
          name: { contains: term, mode: 'insensitive' }
        }
      });

      // Tag name search
      conditions.push({
        tags: {
          some: {
            tag: {
              name: { contains: term, mode: 'insensitive' }
            }
          }
        }
      });

      // Author name search
      conditions.push({
        author: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { surname: { contains: term, mode: 'insensitive' } }
          ]
        }
      });
    });

    return conditions;
  }

  private buildOrderClause(sortBy: SearchSortBy, sortOrder: string, query?: string): any {
    switch (sortBy) {
      case SearchSortBy.DATE:
        return { publishedAt: sortOrder };
      case SearchSortBy.POPULARITY:
        return [
          { views: sortOrder },
          { likes: sortOrder },
          { publishedAt: 'desc' }
        ];
      case SearchSortBy.VIEWS:
        return { views: sortOrder };
      case SearchSortBy.RELEVANCE:
      default:
        // For relevance, we'll sort after calculating scores in the main function
        return { publishedAt: 'desc' };
    }
  }

  private calculateRelevanceScore(article: any, query: string): number {
    if (!query || !query.trim()) return 0;

    const searchTerms = this.extractSearchTerms(query.toLowerCase());
    let score = 0;
    
    searchTerms.forEach(term => {
      const termLower = term.toLowerCase();
      
      // Title matches (highest weight)
      if (article.title?.toLowerCase().includes(termLower)) {
        score += 10;
        // Exact title match gets extra points
        if (article.title?.toLowerCase() === termLower) {
          score += 20;
        }
        // Title starts with term gets extra points
        if (article.title?.toLowerCase().startsWith(termLower)) {
          score += 10;
        }
      }

      // Excerpt matches (medium weight)
      if (article.excerpt?.toLowerCase().includes(termLower)) {
        score += 5;
      }

      // Content matches (lower weight)
      if (article.content?.toLowerCase().includes(termLower)) {
        score += 2;
      }

      // Category matches
      if (article.category?.name?.toLowerCase().includes(termLower)) {
        score += 8;
      }

      // Tag matches
      article.tags?.forEach((articleTag: any) => {
        if (articleTag.tag?.name?.toLowerCase().includes(termLower)) {
          score += 6;
        }
      });

      // Author matches
      const authorName = `${article.author?.name || ''} ${article.author?.surname || ''}`.toLowerCase();
      if (authorName.includes(termLower)) {
        score += 4;
      }
    });

    // Apply popularity bonuses
    if (article.isFeatured) score += 5;
    if (article.isBreaking) score += 8;
    
    // Views and likes bonus (normalized)
    score += Math.min(article.views / 100, 10); // Max 10 points for views
    score += Math.min(article.likes / 10, 5);   // Max 5 points for likes

    // Freshness bonus (recent articles get slight boost)
    const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) {
      score += (7 - daysSincePublished) * 0.5;
    }

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  private formatSearchResult(article: any, score: number, userId?: number): SearchResultItem {
    return {
      id: article.id,
      type: SearchType.ARTICLE,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      url: `/articles/${article.slug}`,
      score,
      publishedAt: article.publishedAt,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug
      } : undefined,
      author: article.author ? {
        id: article.author.id,
        name: `${article.author.name} ${article.author.surname || ''}`.trim()
      } : undefined,
      tags: article.tags?.map((articleTag: any) => ({
        id: articleTag.tag.id,
        name: articleTag.tag.name,
        slug: articleTag.tag.slug
      })) || [],
      metadata: {
        viewCount: article.views,
        likeCount: article._count?.articleLikes || 0,
        commentCount: article._count?.comments || 0,
        bookmarkCount: article._count?.bookmarks || 0,
        isFeatured: article.isFeatured,
        isBreaking: article.isBreaking,
        isLikedByUser: userId ? (article.articleLikes?.length > 0) : false,
        isBookmarkedByUser: userId ? (article.bookmarks?.length > 0) : false,
      }
    };
  }

  private async getSearchAggregations(where: any): Promise<any> {
    // Get category distribution
    const categoryAggregation = await this.prisma.article.groupBy({
      by: ['categoryId'],
      where,
      _count: {
        categoryId: true
      },
      orderBy: {
        _count: {
          categoryId: 'desc'
        }
      },
      take: 10
    });

    const categoryIds = categoryAggregation.map(item => item.categoryId);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
    const categoriesWithCounts = categoryAggregation.map(item => ({
      id: item.categoryId,
      name: categoryMap.get(item.categoryId) || 'Unknown',
      count: item._count.categoryId
    }));

    // For tags and authors, we need a different approach due to the many-to-many relationship
    // This is a simplified version - in production, you might want to use raw SQL for better performance
    
    return {
      categories: categoriesWithCounts,
      tags: [], // TODO: Implement tag aggregation
      authors: [] // TODO: Implement author aggregation
    };
  }
}