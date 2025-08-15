import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  MaxLength, 
  MinLength,
  IsUrl
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'Kullanıcı adı',
    example: 'John Doe Updated',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Ad metin olmalıdır' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(100, { message: 'Ad en fazla 100 karakter olabilir' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Kullanıcı soyadı',
    example: 'Smith Updated',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Soyad metin olmalıdır' })
  @MaxLength(100, { message: 'Soyad en fazla 100 karakter olabilir' })
  surname?: string;

  @ApiPropertyOptional({
    description: 'Kullanıcı adı (username)',
    example: 'johndoe_updated',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Kullanıcı adı metin olmalıdır' })
  @MinLength(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
  @MaxLength(50, { message: 'Kullanıcı adı en fazla 50 karakter olabilir' })
  username?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://example.com/new-avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir URL giriniz' })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Biyografi',
    example: 'Updated bio: Senior software developer with passion for technology',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Biyografi metin olmalıdır' })
  @MaxLength(500, { message: 'Biyografi en fazla 500 karakter olabilir' })
  bio?: string;
}