import { IsOptional, IsString, IsInt, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';

export enum ArticleSortBy {
  CREATED_AT = 'createdAt',
  PUBLISHED_AT = 'publishedAt',
  TITLE = 'title',
  VIEW_COUNT = 'views',
  LIKE_COUNT = 'likes',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ArticleFilterDto {
  @ApiPropertyOptional({
    description: 'Sayfa numarası',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsInt({ message: 'Sayfa numarası bir sayı olmalıdır' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Sayfa başına öğe sayısı',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  @IsInt({ message: 'Limit bir sayı olmalıdır' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Kategori ID ile filtrele',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Kategori ID bir sayı olmalıdır' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Kategori slug ile filtrele',
    example: 'teknoloji',
  })
  @IsOptional()
  @IsString({ message: 'Kategori slug metin olmalıdır' })
  categorySlug?: string;

  @ApiPropertyOptional({
    description: 'Etiket ID listesi ile filtrele',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim()));
    }
    return [];
  })
  @IsInt({ each: true, message: 'Her etiket ID bir sayı olmalıdır' })
  tagIds?: number[];

  @ApiPropertyOptional({
    description: 'Yazar ID ile filtrele',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Yazar ID bir sayı olmalıdır' })
  authorId?: number;

  @ApiPropertyOptional({
    description: 'Arama terimi',
    example: 'teknoloji',
  })
  @IsOptional()
  @IsString({ message: 'Arama terimi metin olmalıdır' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Sadece öne çıkan makaleler',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Öne çıkarma durumu boolean olmalıdır' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Sadece son dakika haberleri',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Son dakika durumu boolean olmalıdır' })
  isBreaking?: boolean;

  @ApiPropertyOptional({
    description: 'Sıralama alanı',
    example: ArticleSortBy.CREATED_AT,
    enum: ArticleSortBy,
    default: ArticleSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ArticleSortBy, { message: 'Geçerli bir sıralama alanı seçiniz' })
  sortBy?: ArticleSortBy = ArticleSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sıralama yönü',
    example: SortOrder.DESC,
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Geçerli bir sıralama yönü seçiniz' })
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Başlangıç tarihi (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString({ message: 'Başlangıç tarihi metin olmalıdır' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Bitiş tarihi (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString({ message: 'Bitiş tarihi metin olmalıdır' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Makale durumu (admin endpoint için)',
    example: ArticleStatus.PUBLISHED,
    enum: ArticleStatus,
  })
  @IsOptional()
  @IsEnum(ArticleStatus, { message: 'Geçerli bir makale durumu seçiniz' })
  status?: ArticleStatus;
}