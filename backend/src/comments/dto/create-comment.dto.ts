import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Yorum içeriği',
    example: 'Bu makalenin çok faydalı olduğunu düşünüyorum.',
    maxLength: 1000,
  })
  @IsString({ message: 'Yorum içeriği metin olmalıdır' })
  @IsNotEmpty({ message: 'Yorum içeriği boş olamaz' })
  @MaxLength(1000, { message: 'Yorum içeriği en fazla 1000 karakter olabilir' })
  content: string;

  @ApiProperty({
    description: 'Makale ID',
    example: 1,
  })
  @IsInt({ message: 'Makale ID sayı olmalıdır' })
  @Min(1, { message: 'Makale ID pozitif bir sayı olmalıdır' })
  articleId: number;

  @ApiProperty({
    description: 'Üst yorum ID (cevap için)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Üst yorum ID sayı olmalıdır' })
  @Min(1, { message: 'Üst yorum ID pozitif bir sayı olmalıdır' })
  parentId?: number;
}