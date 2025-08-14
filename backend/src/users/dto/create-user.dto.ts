import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  IsEnum,
  IsUrl,
  IsStrongPassword
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Kullanıcı adı',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Ad metin olmalıdır' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(100, { message: 'Ad en fazla 100 karakter olabilir' })
  name: string;

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

  @ApiProperty({
    description: 'E-posta adresi',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @ApiProperty({
    description: 'Şifre',
    example: 'StrongPassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Şifre metin olmalıdır' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, { 
    message: 'Şifre en az 8 karakter olmalı ve en az 1 küçük harf, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir' 
  })
  password: string;

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
    description: 'Kullanıcı rolü (sadece admin tarafından atanabilir)',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Geçerli bir rol seçiniz' })
  role?: UserRole = UserRole.USER;
}