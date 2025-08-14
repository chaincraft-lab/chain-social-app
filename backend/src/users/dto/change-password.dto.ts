import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mevcut şifre',
    example: 'OldPassword123!',
  })
  @IsString({ message: 'Mevcut şifre metin olmalıdır' })
  currentPassword: string;

  @ApiProperty({
    description: 'Yeni şifre',
    example: 'NewStrongPassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Yeni şifre metin olmalıdır' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, { 
    message: 'Yeni şifre en az 8 karakter olmalı ve en az 1 küçük harf, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir' 
  })
  newPassword: string;
}