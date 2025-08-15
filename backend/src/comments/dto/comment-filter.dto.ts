import { IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CommentFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Makale ID ile filtrele',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Makale ID sayı olmalıdır' })
  @Min(1, { message: 'Makale ID pozitif bir sayı olmalıdır' })
  articleId?: number;

  @ApiPropertyOptional({
    description: 'Kullanıcı ID ile filtrele',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Kullanıcı ID sayı olmalıdır' })
  @Min(1, { message: 'Kullanıcı ID pozitif bir sayı olmalıdır' })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Yorum durumu ile filtrele',
    enum: CommentStatus,
    example: CommentStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(CommentStatus, { message: 'Geçerli bir yorum durumu seçiniz' })
  status?: CommentStatus;

  @ApiPropertyOptional({
    description: 'Üst yorum ID ile filtrele (sadece cevaplar için)',
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Üst yorum ID sayı olmalıdır' })
  @Min(1, { message: 'Üst yorum ID pozitif bir sayı olmalıdır' })
  parentId?: number;

  @ApiPropertyOptional({
    description: 'Sadece ana yorumları getir (cevap değil)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  onlyParents?: boolean;
}