import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Makale ID',
    example: 1,
  })
  @IsInt({ message: 'Makale ID sayı olmalıdır' })
  @Min(1, { message: 'Makale ID pozitif bir sayı olmalıdır' })
  articleId: number;
}