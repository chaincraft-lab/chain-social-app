import { 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  IsInt, 
  IsArray, 
  IsUrl, 
  IsBoolean 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Makale başlığı',
    example: 'Yeni Teknoloji Gelişmeleri',
    minLength: 5,
    maxLength: 200,
  })
  @IsString({ message: 'Başlık metin olmalıdır' })
  @MinLength(5, { message: 'Başlık en az 5 karakter olmalıdır' })
  @MaxLength(200, { message: 'Başlık en fazla 200 karakter olabilir' })
  title: string;

  @ApiProperty({
    description: 'Makale özeti',
    example: 'Bu makalede en son teknoloji gelişmelerini inceliyoruz...',
    minLength: 20,
    maxLength: 500,
  })
  @IsString({ message: 'Özet metin olmalıdır' })
  @MinLength(20, { message: 'Özet en az 20 karakter olmalıdır' })
  @MaxLength(500, { message: 'Özet en fazla 500 karakter olabilir' })
  excerpt: string;

  @ApiProperty({
    description: 'Makale ana içeriği',
    example: 'Makale içeriği burada yer alacak...',
    minLength: 100,
  })
  @IsString({ message: 'İçerik metin olmalıdır' })
  @MinLength(100, { message: 'İçerik en az 100 karakter olmalıdır' })
  content: string;

  @ApiPropertyOptional({
    description: 'Ana görsel URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir URL giriniz' })
  image?: string;

  @ApiProperty({
    description: 'Kategori ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Kategori ID bir sayı olmalıdır' })
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Etiket ID listesi',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'Etiketler bir dizi olmalıdır' })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id));
    }
    return [];
  })
  @IsInt({ each: true, message: 'Her etiket ID bir sayı olmalıdır' })
  tagIds?: number[];

  @ApiPropertyOptional({
    description: 'Makale öne çıkarılsın mı?',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Öne çıkarma durumu boolean olmalıdır' })
  isFeatured?: boolean = false;

  @ApiPropertyOptional({
    description: 'Son dakika haberi mi?',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Son dakika durumu boolean olmalıdır' })
  isBreaking?: boolean = false;
}