import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class LikeFilterDto extends PaginationDto {
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
}