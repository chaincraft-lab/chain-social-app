import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ 
    description: 'Sayfa numarası', 
    default: 1, 
    minimum: 1 
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Sayfa numarası bir tam sayı olmalıdır' })
  @Min(1, { message: 'Sayfa numarası en az 1 olmalıdır' })
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Sayfa başına öğe sayısı', 
    default: 10, 
    minimum: 1, 
    maximum: 100 
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limit bir tam sayı olmalıdır' })
  @Min(1, { message: 'Limit en az 1 olmalıdır' })
  @Max(100, { message: 'Limit en fazla 100 olabilir' })
  limit?: number = 10;
}

export class PaginationResponseDto<T> {
  @ApiPropertyOptional({ description: 'Veri listesi' })
  data: T[];

  @ApiPropertyOptional({ description: 'Toplam öğe sayısı' })
  total: number;

  @ApiPropertyOptional({ description: 'Mevcut sayfa numarası' })
  page: number;

  @ApiPropertyOptional({ description: 'Sayfa başına öğe sayısı' })
  limit: number;

  @ApiPropertyOptional({ description: 'Toplam sayfa sayısı' })
  totalPages: number;

  @ApiPropertyOptional({ description: 'Bir sonraki sayfa var mı?' })
  hasNext: boolean;

  @ApiPropertyOptional({ description: 'Bir önceki sayfa var mı?' })
  hasPrevious: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrevious = page > 1;
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}