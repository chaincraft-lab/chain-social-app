import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants/auth.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1day' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UsersService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
