import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body(ValidationPipe) data: LoginDto,
    @Req() req,
  ) {
    let user = await this.authService.login(data, req.user);
    return {
      message: 'Login successful',
      data: user,
    }
  }
}
