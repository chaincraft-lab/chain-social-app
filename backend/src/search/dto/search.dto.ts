import { IsOptional, IsString, IsInt, IsEnum, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchType, SearchSortBy, SearchSortOrder } from '../interfaces/search.interface';

export class SearchFiltersDto {
  @ApiPropertyOptional({
    description: 'Kategori ID listesi',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    return [];
  })
  categoryIds?: number[];

  @ApiPropertyOptional({
    description: 'Etiket ID listesi',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    return [];
  })
  tagIds?: number[];

  @ApiPropertyOptional({
    description: 'Yazar ID listesi',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    return [];
  })
  authorIds?: number[];

  @ApiPropertyOptional({
    description: 'Başlangıç tarihi',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Bitiş tarihi',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Sadece öne çıkan içerikler',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Sadece son dakika haberleri',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isBreaking?: boolean;
}

export class SearchQueryDto {
  @ApiProperty({
    description: 'Arama sorgusu',
    example: 'savunma sanayi',
    minLength: 1
  })
  @IsString({ message: 'Arama sorgusu metin olmalıdır' })
  @Transform(({ value }) => value?.trim())
  query: string;

  @ApiPropertyOptional({
    description: 'Arama türü',
    example: SearchType.ARTICLE,
    enum: SearchType,
    default: SearchType.ALL
  })
  @IsOptional()
  @IsEnum(SearchType, { message: 'Geçerli bir arama türü seçiniz' })
  type?: SearchType = SearchType.ALL;

  @ApiPropertyOptional({
    description: 'Sayfa numarası',
    example: 1,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsInt({ message: 'Sayfa numarası bir sayı olmalıdır' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Sayfa başına öğe sayısı',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => Math.min(parseInt(value) || 10, 100))
  @IsInt({ message: 'Limit bir sayı olmalıdır' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sıralama kriteri',
    example: SearchSortBy.RELEVANCE,
    enum: SearchSortBy,
    default: SearchSortBy.RELEVANCE
  })
  @IsOptional()
  @IsEnum(SearchSortBy, { message: 'Geçerli bir sıralama kriteri seçiniz' })
  sortBy?: SearchSortBy = SearchSortBy.RELEVANCE;

  @ApiPropertyOptional({
    description: 'Sıralama yönü',
    example: SearchSortOrder.DESC,
    enum: SearchSortOrder,
    default: SearchSortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SearchSortOrder, { message: 'Geçerli bir sıralama yönü seçiniz' })
  sortOrder?: SearchSortOrder = SearchSortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Arama filtreleri',
    type: SearchFiltersDto
  })
  @IsOptional()
  @Type(() => SearchFiltersDto)
  filters?: SearchFiltersDto;
}

export class SearchSuggestionDto {
  @ApiProperty({
    description: 'Öneri sorgusu',
    example: 'savun',
    minLength: 1
  })
  @IsString({ message: 'Öneri sorgusu metin olmalıdır' })
  @Transform(({ value }) => value?.trim())
  query: string;

  @ApiPropertyOptional({
    description: 'Öneri türü',
    example: SearchType.ARTICLE,
    enum: SearchType,
    default: SearchType.ALL
  })
  @IsOptional()
  @IsEnum(SearchType, { message: 'Geçerli bir öneri türü seçiniz' })
  type?: SearchType = SearchType.ALL;
}

export class SearchResultItemDto {
  @ApiProperty({ description: 'İçerik ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'İçerik türü', enum: SearchType })
  type: SearchType;

  @ApiProperty({ description: 'Başlık', example: 'Savunma Sanayi Haberi' })
  title: string;

  @ApiPropertyOptional({ description: 'Özet', example: 'Bu haberin özeti...' })
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Görsel URL' })
  image?: string;

  @ApiProperty({ description: 'İçerik URL', example: '/articles/sample-slug' })
  url: string;

  @ApiProperty({ description: 'Alakalılık puanı', example: 0.95 })
  score: number;

  @ApiPropertyOptional({ description: 'Yayın tarihi' })
  publishedAt?: Date;

  @ApiPropertyOptional({ description: 'Kategori bilgisi' })
  category?: {
    id: number;
    name: string;
    slug: string;
  };

  @ApiPropertyOptional({ description: 'Yazar bilgisi' })
  author?: {
    id: number;
    name: string;
  };

  @ApiPropertyOptional({ description: 'Etiketler' })
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  @ApiPropertyOptional({ description: 'Ek meta veriler' })
  metadata?: Record<string, any>;
}

export class SearchAggregationDto {
  @ApiPropertyOptional({ description: 'Kategori dağılımı' })
  categories?: Array<{ id: number; name: string; count: number }>;

  @ApiPropertyOptional({ description: 'Etiket dağılımı' })
  tags?: Array<{ id: number; name: string; count: number }>;

  @ApiPropertyOptional({ description: 'Yazar dağılımı' })
  authors?: Array<{ id: number; name: string; count: number }>;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'Arama sonuçları', type: [SearchResultItemDto] })
  items: SearchResultItemDto[];

  @ApiProperty({ description: 'Toplam sonuç sayısı', example: 100 })
  total: number;

  @ApiProperty({ description: 'Mevcut sayfa', example: 1 })
  page: number;

  @ApiProperty({ description: 'Sayfa başına öğe sayısı', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Toplam sayfa sayısı', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Sonraki sayfa var mı', example: true })
  hasNext: boolean;

  @ApiProperty({ description: 'Önceki sayfa var mı', example: false })
  hasPrevious: boolean;

  @ApiProperty({ description: 'Arama süresi (ms)', example: 15 })
  searchTime: number;

  @ApiPropertyOptional({ description: 'Arama önerileri', type: [String] })
  suggestions?: string[];

  @ApiPropertyOptional({ description: 'Sonuç dağılımları', type: SearchAggregationDto })
  aggregations?: SearchAggregationDto;
}

export class SearchSuggestionResponseDto {
  @ApiProperty({ description: 'Arama önerileri', type: [String] })
  suggestions: string[];
}