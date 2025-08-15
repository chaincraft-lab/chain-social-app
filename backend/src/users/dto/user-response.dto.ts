import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'Kullanıcı ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Kullanıcı UUID',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  uuid: string;

  @ApiProperty({
    description: 'Kullanıcı adı',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Kullanıcı soyadı',
    example: 'Smith',
    required: false,
  })
  surname?: string;

  @ApiProperty({
    description: 'Kullanıcı adı (username)',
    example: 'johndoe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'E-posta adresi',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Biyografi',
    example: 'Software developer passionate about technology',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'Kullanıcı rolü',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Aktif durumu',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Son giriş tarihi',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  lastLogin?: Date;

  @ApiProperty({
    description: 'Oluşturulma tarihi',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Güncellenme tarihi',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}