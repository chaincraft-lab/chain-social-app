import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User email', example: "john@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'User password', example: "testPass1?." })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  public password: string;
}
