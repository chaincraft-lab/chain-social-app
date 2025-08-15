import { ApiProperty } from '@nestjs/swagger';

export class BookmarkUserDto {
  @ApiProperty({ description: 'Kullanıcı ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Kullanıcı UUID', example: 'abc-123-def' })
  uuid: string;

  @ApiProperty({ description: 'Kullanıcı adı', example: 'John' })
  name: string;

  @ApiProperty({ description: 'Kullanıcı soyadı', example: 'Doe' })
  surname: string;

  @ApiProperty({ description: 'Kullanıcı adı (username)', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg' })
  avatar?: string;
}

export class BookmarkArticleDto {
  @ApiProperty({ description: 'Makale ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Makale başlığı', example: 'Sample Article Title' })
  title: string;

  @ApiProperty({ description: 'Makale slug', example: 'sample-article-title' })
  slug: string;

  @ApiProperty({ description: 'Makale özeti', example: 'This is a sample article excerpt...' })
  excerpt: string;

  @ApiProperty({ description: 'Makale görseli', example: 'https://example.com/image.jpg' })
  image?: string;

  @ApiProperty({ description: 'Yayın tarihi', example: '2024-01-01T00:00:00.000Z' })
  publishedAt?: Date;

  @ApiProperty({ description: 'Kategori adı', example: 'Technology' })
  categoryName: string;

  @ApiProperty({ description: 'Yazar adı', example: 'John Doe' })
  authorName: string;
}

export class BookmarkResponseDto {
  @ApiProperty({ description: 'Bookmark ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Makale ID', example: 1 })
  articleId: number;

  @ApiProperty({ description: 'Kullanıcı ID', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Bookmark tarihi', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Bookmark ekleyen kullanıcı bilgileri',
    type: BookmarkUserDto,
    required: false
  })
  user?: BookmarkUserDto;

  @ApiProperty({ 
    description: 'Bookmark edilen makale bilgileri',
    type: BookmarkArticleDto,
    required: false
  })
  article?: BookmarkArticleDto;
}