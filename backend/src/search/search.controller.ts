import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './services/search.service';
import { 
  SearchQueryDto, 
  SearchSuggestionDto, 
  SearchResponseDto, 
  SearchSuggestionResponseDto 
} from './dto/search.dto';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { SearchOptions, SearchFilters } from './interfaces/search.interface';

interface CurrentUserType {
  userId: number;
  uuid: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  role: UserRole;
}

@ApiTags('Search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Genel arama',
    description: 'Makale, kategori, etiket ve diğer içeriklerde arama yapar. Gelişmiş filtreleme ve sıralama seçenekleri sunar.'
  })
  @ApiResponse({
    status: 200,
    description: 'Arama sonuçları başarıyla getirildi',
    type: SearchResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz arama parametreleri' })
  @ApiQuery({ name: 'query', required: true, description: 'Arama sorgusu', example: 'savunma sanayi' })
  @ApiQuery({ name: 'type', required: false, description: 'Arama türü', example: 'article' })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sıralama kriteri', example: 'relevance' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sıralama yönü', example: 'desc' })
  @ApiQuery({ name: 'categoryIds', required: false, description: 'Kategori ID listesi (virgülle ayrılmış)', example: '1,2,3' })
  @ApiQuery({ name: 'tagIds', required: false, description: 'Etiket ID listesi (virgülle ayrılmış)', example: '1,2,3' })
  @ApiQuery({ name: 'authorIds', required: false, description: 'Yazar ID listesi (virgülle ayrılmış)', example: '1,2' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Başlangıç tarihi', example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Bitiş tarihi', example: '2024-12-31' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Sadece öne çıkan içerikler', example: true })
  @ApiQuery({ name: 'isBreaking', required: false, description: 'Sadece son dakika haberleri', example: true })
  @HttpCode(HttpStatus.OK)
  async search(
    @Query(new ValidationPipe({ transform: true })) searchQuery: SearchQueryDto,
    @CurrentUser() user?: CurrentUserType,
  ): Promise<SearchResponseDto> {
    const filters: SearchFilters = {};

    // Map DTO filters to interface filters
    if (searchQuery.filters) {
      if (searchQuery.filters.categoryIds?.length > 0) {
        filters.categoryIds = searchQuery.filters.categoryIds;
      }
      if (searchQuery.filters.tagIds?.length > 0) {
        filters.tagIds = searchQuery.filters.tagIds;
      }
      if (searchQuery.filters.authorIds?.length > 0) {
        filters.authorIds = searchQuery.filters.authorIds;
      }
      if (searchQuery.filters.dateFrom) {
        filters.dateFrom = new Date(searchQuery.filters.dateFrom);
      }
      if (searchQuery.filters.dateTo) {
        filters.dateTo = new Date(searchQuery.filters.dateTo);
      }
      if (typeof searchQuery.filters.isFeatured === 'boolean') {
        filters.isFeatured = searchQuery.filters.isFeatured;
      }
      if (typeof searchQuery.filters.isBreaking === 'boolean') {
        filters.isBreaking = searchQuery.filters.isBreaking;
      }
    }

    const searchOptions: SearchOptions = {
      query: searchQuery.query,
      type: searchQuery.type,
      page: searchQuery.page,
      limit: searchQuery.limit,
      sortBy: searchQuery.sortBy,
      sortOrder: searchQuery.sortOrder,
      filters,
      userId: user?.userId,
    };

    const result = await this.searchService.search(searchOptions);
    
    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrevious: result.hasPrevious,
      searchTime: result.searchTime,
      suggestions: result.suggestions,
      aggregations: result.aggregations,
    };
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Arama önerileri',
    description: 'Verilen sorgu için arama önerileri getirir'
  })
  @ApiResponse({
    status: 200,
    description: 'Öneriler başarıyla getirildi',
    type: SearchSuggestionResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz öneri parametreleri' })
  @ApiQuery({ name: 'query', required: true, description: 'Öneri sorgusu', example: 'savun' })
  @ApiQuery({ name: 'type', required: false, description: 'Öneri türü', example: 'article' })
  @HttpCode(HttpStatus.OK)
  async getSuggestions(
    @Query(new ValidationPipe({ transform: true })) suggestionQuery: SearchSuggestionDto,
  ): Promise<SearchSuggestionResponseDto> {
    const suggestions = await this.searchService.suggest(
      suggestionQuery.query,
      suggestionQuery.type
    );

    return { suggestions };
  }

  @Get('popular')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Popüler arama terimleri',
    description: 'En çok aranan terimleri getirir'
  })
  @ApiResponse({
    status: 200,
    description: 'Popüler terimler başarıyla getirildi',
    type: SearchSuggestionResponseDto
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum terim sayısı', example: 10 })
  @HttpCode(HttpStatus.OK)
  async getPopularSearchTerms(
    @Query('limit') limit: string = '10',
  ): Promise<SearchSuggestionResponseDto> {
    // For now, return static popular terms
    // In production, you might want to track search analytics
    const popularTerms = [
      'savunma sanayi',
      'milli teknoloji',
      'İHA',
      'Baykar',
      'TUSAŞ',
      'Aselsan',
      'Roketsan',
      'yerli imkanlar',
      'savunma sistemi',
      'teknoloji transferi'
    ];

    const limitNum = Math.min(parseInt(limit) || 10, 20);
    
    return {
      suggestions: popularTerms.slice(0, limitNum)
    };
  }

  @Get('recent')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Son aramalar',
    description: 'Kullanıcının son arama geçmişini getirir (gelecekte implement edilecek)'
  })
  @ApiResponse({
    status: 200,
    description: 'Son aramalar başarıyla getirildi',
    type: SearchSuggestionResponseDto
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @HttpCode(HttpStatus.OK)
  async getRecentSearches(
    @CurrentUser() user?: CurrentUserType,
  ): Promise<SearchSuggestionResponseDto> {
    // TODO: Implement user search history tracking
    // For now, return empty array
    return {
      suggestions: []
    };
  }

  @Get('autocomplete')
  @ApiOperation({
    summary: 'Otomatik tamamlama',
    description: 'Yazım sırasında anlık öneriler getirir'
  })
  @ApiResponse({
    status: 200,
    description: 'Otomatik tamamlama önerileri başarıyla getirildi',
    type: SearchSuggestionResponseDto
  })
  @ApiQuery({ name: 'q', required: true, description: 'Kısmi sorgu', example: 'sav' })
  @ApiQuery({ name: 'type', required: false, description: 'Tamamlama türü', example: 'article' })
  @HttpCode(HttpStatus.OK)
  async getAutocomplete(
    @Query('q') query: string,
    @Query('type') type: string = 'all',
  ): Promise<SearchSuggestionResponseDto> {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const suggestions = await this.searchService.suggest(query, type as any);
    
    // For autocomplete, we want more immediate and relevant suggestions
    const autocompleteSuggestions = suggestions
      .filter(suggestion => suggestion.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);

    return {
      suggestions: autocompleteSuggestions
    };
  }
}