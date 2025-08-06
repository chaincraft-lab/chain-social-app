import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: "john@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'User password', example: "testPass1?." })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Must contain at least one digit (0-9) or special character, one uppercase letter and lowercase letter ',
  })
  public password: string;

  @ApiProperty({ description: 'User confirm password', example: "testPass1?." })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Must contain at least one digit (0-9) or special character, one uppercase letter and lowercase letter ',
  })
  public confirmPassword: string;

  @ApiProperty({ description: 'User name', example: "John" })
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  public name: string;

  @ApiProperty({ description: 'User surname', example: "Doe" })
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  public surname: string;

  @ApiProperty({ description: 'User username', example: "john123" })
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  public username: string;
}
