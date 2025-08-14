import { ApiProperty } from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';

export class CommentUserDto {
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

export class CommentResponseDto {
  @ApiProperty({ description: 'Yorum ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Yorum içeriği', example: 'Bu makale çok faydalı.' })
  content: string;

  @ApiProperty({ 
    description: 'Yorum durumu', 
    enum: CommentStatus,
    example: CommentStatus.APPROVED 
  })
  status: CommentStatus;

  @ApiProperty({ description: 'Makale ID', example: 1 })
  articleId: number;

  @ApiProperty({ description: 'Üst yorum ID', example: null, required: false })
  parentId?: number;

  @ApiProperty({ description: 'Oluşturma tarihi', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Güncelleme tarihi', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Yorum sahibi kullanıcı bilgileri',
    type: CommentUserDto
  })
  user: CommentUserDto;

  @ApiProperty({ 
    description: 'Alt yorumlar',
    type: [CommentResponseDto],
    required: false
  })
  replies?: CommentResponseDto[];

  @ApiProperty({ description: 'Alt yorum sayısı', example: 3 })
  repliesCount: number;
}