import { IsString, IsOptional, MinLength, MaxLength, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Teknoloji',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Kategori adı metin olmalıdır' })
  @MinLength(2, { message: 'Kategori adı en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Kategori adı en fazla 50 karakter olabilir' })
  name: string;

  @ApiPropertyOptional({
    description: 'Kategori açıklaması',
    example: 'Teknoloji ile ilgili haberler',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Açıklama metin olmalıdır' })
  @MaxLength(200, { message: 'Açıklama en fazla 200 karakter olabilir' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Kategori rengi (hex format)',
    example: '#007bff',
  })
  @IsOptional()
  @IsHexColor({ message: 'Geçerli bir hex renk kodu giriniz (örn: #007bff)' })
  color?: string;

  @ApiPropertyOptional({
    description: 'Kategori ikonu',
    example: 'mdi-laptop',
  })
  @IsOptional()
  @IsString({ message: 'İkon adı metin olmalıdır' })
  @MaxLength(50, { message: 'İkon adı en fazla 50 karakter olabilir' })
  icon?: string;

  @ApiPropertyOptional({
    description: 'Protokol resmi websitesi',
    example: 'https://arbitrum.io',
  })
  @IsOptional()
  @IsString({ message: 'Website URL metin olmalıdır' })
  @MaxLength(255, { message: 'Website URL en fazla 255 karakter olabilir' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Token sembolü',
    example: 'ARB',
  })
  @IsOptional()
  @IsString({ message: 'Token sembolü metin olmalıdır' })
  @MaxLength(10, { message: 'Token sembolü en fazla 10 karakter olabilir' })
  tokenSymbol?: string;

  @ApiPropertyOptional({
    description: 'Ana blockchain',
    example: 'Ethereum',
  })
  @IsOptional()
  @IsString({ message: 'Blockchain adı metin olmalıdır' })
  @MaxLength(50, { message: 'Blockchain adı en fazla 50 karakter olabilir' })
  blockchain?: string;
}