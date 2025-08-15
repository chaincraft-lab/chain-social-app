import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag adı',
    example: 'Teknoloji',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Tag adı metin olmalıdır' })
  @IsNotEmpty({ message: 'Tag adı boş olamaz' })
  @MinLength(2, { message: 'Tag adı en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Tag adı en fazla 50 karakter olabilir' })
  @Matches(/^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s\-_]+$/, {
    message: 'Tag adı sadece harf, rakam, boşluk, tire ve alt çizgi içerebilir'
  })
  name: string;
}