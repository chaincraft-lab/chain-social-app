import { ApiProperty } from '@nestjs/swagger';

export class CategoryBasicDto {
  @ApiProperty({
    description: 'Kategori ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Kategori adı',
    example: 'Teknoloji',
  })
  name: string;

  @ApiProperty({
    description: 'Kategori slug',
    example: 'teknoloji',
  })
  slug: string;

  @ApiProperty({
    description: 'Kategori rengi',
    example: '#007bff',
  })
  color?: string;

  @ApiProperty({
    description: 'Kategori ikonu',
    example: 'mdi-laptop',
  })
  icon?: string;
}

export class TagBasicDto {
  @ApiProperty({
    description: 'Etiket ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Etiket adı',
    example: 'JavaScript',
  })
  name: string;

  @ApiProperty({
    description: 'Etiket slug',
    example: 'javascript',
  })
  slug: string;
}

export class UserBasicDto {
  @ApiProperty({
    description: 'Yazar ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Yazar adı',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Yazar email',
    example: 'john@example.com',
  })
  email: string;
}

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Makale ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Makale başlığı',
    example: 'Yeni Teknoloji Gelişmeleri',
  })
  title: string;

  @ApiProperty({
    description: 'Makale slug',
    example: 'yeni-teknoloji-gelismeleri',
  })
  slug: string;

  @ApiProperty({
    description: 'Makale özeti',
    example: 'Bu makalede en son teknoloji gelişmelerini inceliyoruz...',
  })
  excerpt: string;

  @ApiProperty({
    description: 'Makale ana içeriği',
    example: 'Makale içeriği burada yer alacak...',
  })
  content: string;

  @ApiProperty({
    description: 'Ana görsel URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Makale öne çıkarılsın mı?',
    example: false,
  })
  isFeatured: boolean;

  @ApiProperty({
    description: 'Son dakika haberi mi?',
    example: false,
  })
  isBreaking: boolean;

  @ApiProperty({
    description: 'Makale aktif mi?',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Yayınlanma tarihi',
    example: '2024-01-15T10:30:00Z',
  })
  publishedAt?: Date;

  @ApiProperty({
    description: 'Oluşturulma tarihi',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Güncellenme tarihi',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Kategori bilgisi',
    type: CategoryBasicDto,
  })
  category: CategoryBasicDto;

  @ApiProperty({
    description: 'Etiket listesi',
    type: [TagBasicDto],
  })
  tags: TagBasicDto[];

  @ApiProperty({
    description: 'Yazar bilgisi',
    type: UserBasicDto,
  })
  author: UserBasicDto;

  @ApiProperty({
    description: 'Okunma sayısı',
    example: 150,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Beğeni sayısı',
    example: 25,
  })
  likeCount: number;

  @ApiProperty({
    description: 'Yorum sayısı',
    example: 5,
  })
  commentCount: number;

  @ApiProperty({
    description: 'Kullanıcı bu makaleyi beğendi mi?',
    example: false,
    required: false,
  })
  isLikedByUser?: boolean;

  @ApiProperty({
    description: 'Kullanıcı bu makaleyi yer imlerine ekledi mi?',
    example: false,
    required: false,
  })
  isBookmarkedByUser?: boolean;
}