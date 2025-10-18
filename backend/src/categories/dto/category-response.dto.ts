import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Kategori ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Kategori adı', example: 'Teknoloji' })
  name: string;

  @ApiProperty({ description: 'URL dostu slug', example: 'teknoloji' })
  slug: string;

  @ApiPropertyOptional({ description: 'Kategori açıklaması' })
  description?: string;

  @ApiPropertyOptional({ description: 'Kategori rengi', example: '#007bff' })
  color?: string;

  @ApiPropertyOptional({ description: 'Kategori ikonu', example: 'mdi-laptop' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Protokol resmi websitesi', example: 'https://arbitrum.io' })
  website?: string;

  @ApiPropertyOptional({ description: 'Token sembolü', example: 'ARB' })
  tokenSymbol?: string;

  @ApiPropertyOptional({ description: 'Ana blockchain', example: 'Ethereum' })
  blockchain?: string;

  @ApiProperty({ description: 'Aktif mi?', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Oluşturulma tarihi' })
  createdAt: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Bu kategorideki makale sayısı' })
  articleCount?: number;
}