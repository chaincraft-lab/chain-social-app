import { ApiProperty } from '@nestjs/swagger';

export class LikeUserDto {
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

export class LikeArticleDto {
  @ApiProperty({ description: 'Makale ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Makale başlığı', example: 'Sample Article Title' })
  title: string;

  @ApiProperty({ description: 'Makale slug', example: 'sample-article-title' })
  slug: string;

  @ApiProperty({ description: 'Makale görseli', example: 'https://example.com/image.jpg' })
  image?: string;
}

export class LikeResponseDto {
  @ApiProperty({ description: 'Beğeni ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Makale ID', example: 1 })
  articleId: number;

  @ApiProperty({ description: 'Kullanıcı ID', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Beğeni tarihi', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Beğenen kullanıcı bilgileri',
    type: LikeUserDto,
    required: false
  })
  user?: LikeUserDto;

  @ApiProperty({ 
    description: 'Beğenilen makale bilgileri',
    type: LikeArticleDto,
    required: false
  })
  article?: LikeArticleDto;
}

export class ArticleLikeStatsDto {
  @ApiProperty({ description: 'Makale ID', example: 1 })
  articleId: number;

  @ApiProperty({ description: 'Toplam beğeni sayısı', example: 42 })
  likesCount: number;

  @ApiProperty({ description: 'Kullanıcının bu makaleyi beğenip beğenmediği', example: true })
  isLikedByUser: boolean;
}