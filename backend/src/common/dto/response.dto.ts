import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ description: 'İşlem başarılı mı?', default: true })
  success: boolean = true;

  @ApiProperty({ description: 'HTTP durum kodu' })
  statusCode: number;

  @ApiProperty({ description: 'Başarı mesajı' })
  message: string;

  @ApiPropertyOptional({ description: 'Dönen veri' })
  data?: T;

  @ApiPropertyOptional({ description: 'İşlem zamanı' })
  timestamp: string = new Date().toISOString();

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'İşlem başarılı mı?', default: false })
  success: boolean = false;

  @ApiProperty({ description: 'HTTP durum kodu' })
  statusCode: number;

  @ApiProperty({ description: 'Hata mesajı' })
  message: string;

  @ApiPropertyOptional({ description: 'Detaylı hata bilgisi' })
  error?: string;

  @ApiPropertyOptional({ description: 'Doğrulama hataları' })
  details?: any[];

  @ApiProperty({ description: 'İşlem zamanı' })
  timestamp: string = new Date().toISOString();

  constructor(statusCode: number, message: string, error?: string, details?: any[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.details = details;
  }
}