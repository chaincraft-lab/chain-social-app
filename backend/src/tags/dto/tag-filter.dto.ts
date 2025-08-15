import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class TagFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Tag adında arama terimi',
    example: 'tekno',
  })
  @IsOptional()
  @IsString({ message: 'Arama terimi metin olmalıdır' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Makale sayısına göre sıralama (varsayılan: false)',
    example: true,
  })
  @IsOptional()
  sortByArticleCount?: boolean;
}