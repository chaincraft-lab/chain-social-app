import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({ description: 'Tag ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tag adı', example: 'Teknoloji' })
  name: string;

  @ApiProperty({ description: 'Tag slug', example: 'teknoloji' })
  slug: string;

  @ApiProperty({ description: 'Oluşturma tarihi', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Bu tag ile ilişkili makale sayısı', example: 15 })
  articlesCount?: number;
}

export class TagWithArticlesDto extends TagResponseDto {
  @ApiProperty({ 
    description: 'Bu tag ile ilişkili makaleler',
    type: 'object',
    isArray: true
  })
  articles?: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    publishedAt?: Date;
    categoryName: string;
    authorName: string;
  }>;
}