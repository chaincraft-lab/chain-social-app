import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { IUpdateUserDetailsDto } from './interfaces/user.interface';
// import { IUserDetailsDto } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async updateUserDetails(
    userId: string,
    udetails: IUpdateUserDetailsDto,
  ) {
    const { userDetails, address } = udetails
    await this.prisma.userDetails.update({
      where: { userId: userId },
      data: {
        ...userDetails,
        address: {
          upsert: {
            create: {
              ...address
            },
            update: {
              ...address
            }
          }
        }
      }
    });
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid: userId },
      include: {
        userDetails: true
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      userDetails: user.userDetails,
    };
  }

  async findOneById(id: string) {
    const user = await this.prisma.users.findFirst({
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
    const user = await this.prisma.users.findFirst({
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
    const userPassword = await this.prisma.users.findFirst({
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
