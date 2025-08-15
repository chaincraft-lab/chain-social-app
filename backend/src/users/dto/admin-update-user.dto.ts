import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  MaxLength, 
  MinLength,
  IsUrl,
  IsEnum,
  IsBoolean
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class AdminUpdateUserDto {
  @ApiPropertyOptional({
    description: 'Kullanıcı adı',
    example: 'John Doe',
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
    example: 'Smith',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Soyad metin olmalıdır' })
  @MaxLength(100, { message: 'Soyad en fazla 100 karakter olabilir' })
  surname?: string;

  @ApiPropertyOptional({
    description: 'Kullanıcı adı (username)',
    example: 'johndoe',
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
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir URL giriniz' })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Biyografi',
    example: 'Software developer passionate about technology',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Biyografi metin olmalıdır' })
  @MaxLength(500, { message: 'Biyografi en fazla 500 karakter olabilir' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Kullanıcı rolü',
    enum: UserRole,
    example: UserRole.AUTHOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Geçerli bir rol seçiniz' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Aktif durumu',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Aktif durumu boolean olmalıdır' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Bloklu durumu',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Bloklu durumu boolean olmalıdır' })
  isBlocked?: boolean;
}