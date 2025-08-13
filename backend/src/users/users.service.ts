import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
// import { IUserDetailsDto } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }



  async findOneById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid: id,
        isDeleted: false,
        isBlocked: false,
      },
    });
    delete user.password
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDeleted: false,
        isBlocked: false,
      },
    });

    delete user?.password
    return user;
  }

  async getHashedUserPass(email: string) {
    const userPassword = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDeleted: false,
        isBlocked: false,
      },
      select: {
        password: true
      },
    });
    return userPassword
  }
}
