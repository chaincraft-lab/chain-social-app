import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class BookmarkFilterDto extends PaginationDto {
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
    description: 'Makale ID ile filtrele',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Makale ID sayı olmalıdır' })
  @Min(1, { message: 'Makale ID pozitif bir sayı olmalıdır' })
  articleId?: number;

  @ApiPropertyOptional({
    description: 'Sıralama alanı',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sıralama yönü',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}