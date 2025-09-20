import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { 
  SearchOptions, 
  SearchResult, 
  SearchType, 
  SearchSortBy, 
  SearchResultItem,
  SearchProvider
} from '../interfaces/search.interface';
import { ArticleSearchService } from './article-search.service';

@Injectable()
export class SearchService implements SearchProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articleSearchService: ArticleSearchService,
  ) {}

  async search(options: SearchOptions): Promise<SearchResult> {
    const startTime = Date.now();
    
    const { type = SearchType.ALL } = options;
    
    let result: SearchResult;

    switch (type) {
      case SearchType.ARTICLE:
        result = await this.articleSearchService.search(options);
        break;
      case SearchType.ALL:
        result = await this.searchAll(options);
        break;
      default:
        // For future implementations (USER, CATEGORY, TAG)
        result = await this.searchAll(options);
    }

    const searchTime = Date.now() - startTime;
    result.searchTime = searchTime;

    // Add search suggestions if query is too short or no results
    if (options.query.length < 3 || result.total === 0) {
      result.suggestions = await this.suggest(options.query, type);
    }

    return result;
  }

  async suggest(query: string, type: SearchType = SearchType.ALL): Promise<string[]> {
    const suggestions: string[] = [];
    
    if (query.length < 2) {
      return suggestions;
    }

    // Get article title suggestions
    if (type === SearchType.ARTICLE || type === SearchType.ALL) {
      const articleSuggestions = await this.getArticleSuggestions(query);
      suggestions.push(...articleSuggestions);
    }

    // Get category suggestions
    if (type === SearchType.CATEGORY || type === SearchType.ALL) {
      const categorySuggestions = await this.getCategorySuggestions(query);
      suggestions.push(...categorySuggestions);
    }

    // Get tag suggestions
    if (type === SearchType.TAG || type === SearchType.ALL) {
      const tagSuggestions = await this.getTagSuggestions(query);
      suggestions.push(...tagSuggestions);
    }

    // Remove duplicates and limit to 10
    return [...new Set(suggestions)].slice(0, 10);
  }

  async index(entity: any, type: SearchType): Promise<void> {
    // For future implementation with external search engines like Elasticsearch
    // Currently using database search, so no separate indexing needed
  }

  async removeFromIndex(id: number, type: SearchType): Promise<void> {
    // For future implementation with external search engines
  }

  private async searchAll(options: SearchOptions): Promise<SearchResult> {
    // For now, only search articles when type is ALL
    // In future, combine results from multiple types
    return this.articleSearchService.search({
      ...options,
      type: SearchType.ARTICLE
    });
  }

  private async getArticleSuggestions(query: string): Promise<string[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { title: true },
      take: 5,
      orderBy: { views: 'desc' }
    });

    return articles.map(article => article.title);
  }

  private async getCategorySuggestions(query: string): Promise<string[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        name: { contains: query, mode: 'insensitive' }
      },
      select: { name: true },
      take: 3
    });

    return categories.map(category => category.name);
  }

  private async getTagSuggestions(query: string): Promise<string[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: { name: true },
      take: 3
    });

    return tags.map(tag => tag.name);
  }
}