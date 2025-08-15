import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UserFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Arama terimi (ad, soyad, email, username)',
    example: 'john',
  })
  @IsOptional()
  @IsString({ message: 'Arama terimi metin olmalıdır' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Kullanıcı rolü ile filtrele',
    enum: UserRole,
    example: UserRole.AUTHOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Geçerli bir rol seçiniz' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Aktif durumu ile filtrele',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Aktif durumu boolean olmalıdır' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Bloklu durumu ile filtrele',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Bloklu durumu boolean olmalıdır' })
  isBlocked?: boolean;

  @ApiPropertyOptional({
    description: 'Silinen kullanıcıları dahil et (sadece admin)',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Silinen kullanıcıları dahil etme durumu boolean olmalıdır' })
  includeDeleted?: boolean;
}