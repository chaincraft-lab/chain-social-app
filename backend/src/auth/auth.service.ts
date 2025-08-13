import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { hashPasswordFunc, isPasswordMatch } from './common/auth.common';
import { IUser } from '../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: Partial<Prisma.UserCreateInput>): Promise<object> {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new HttpException('User already exists!', 409);
    }
    const hashedPassword = await hashPasswordFunc(registerDto.password);
    try {
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          surname: registerDto.surname,
          username: registerDto.username,
        },
      });
      return {
        message: 'You have been successfully registered.',
        status: 201,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(`${error.meta?.target} is already taken!`, 409);
        }
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<IUser> {
    const userPass = await this.userService.getHashedUserPass(email);
    if (userPass) {
      const isMatch = await isPasswordMatch(password, userPass.password);
      if (isMatch) {
        const user = await this.userService.findOneByEmail(email)
        const {...userData } = user;
        return userData;
      }
    }
    return null;
  }

  async login(user: LoginDto, userInfo: IUser) {
    const payload = { email: user.email, sub: userInfo.uuid };
    const getUser = await this.userService.findOneById(userInfo.uuid)


    await this.prisma.user.update({
      where: {
        id: userInfo.id
      },
      data: {
        lastLogin: new Date()
      }
    })

    const userResponse = {
      id : getUser.id,
      uuid : getUser.uuid,
      email : getUser.email,
      name : getUser.name,
      surname : getUser.surname,
      username : getUser.username,
    }

    return {
      ...userResponse, 
      access_token: this.jwtService.sign(payload),
    };
  }
}
