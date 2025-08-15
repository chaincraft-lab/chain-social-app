import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Yorum içeriği',
    example: 'Güncellenen yorum içeriği.',
    maxLength: 1000,
  })
  @IsString({ message: 'Yorum içeriği metin olmalıdır' })
  @IsNotEmpty({ message: 'Yorum içeriği boş olamaz' })
  @MaxLength(1000, { message: 'Yorum içeriği en fazla 1000 karakter olabilir' })
  content: string;
}