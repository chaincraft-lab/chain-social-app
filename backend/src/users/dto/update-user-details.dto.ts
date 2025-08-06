import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'User name', example: 'Ahmet Yılmaz', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'User avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsUrl()
    avatar?: string;

    @ApiProperty({ description: 'User bio', example: 'Savunma teknolojileri uzmanı', required: false })
    @IsOptional()
    @IsString()
    bio?: string;
}