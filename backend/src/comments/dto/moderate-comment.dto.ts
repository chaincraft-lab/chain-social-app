import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CommentStatus } from '@prisma/client';

export class ModerateCommentDto {
  @ApiProperty({
    description: 'Yorum durumu',
    enum: CommentStatus,
    example: CommentStatus.APPROVED,
  })
  @IsEnum(CommentStatus, { message: 'Geçerli bir yorum durumu seçiniz' })
  status: CommentStatus;
}