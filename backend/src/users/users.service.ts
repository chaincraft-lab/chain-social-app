import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  ForbiddenException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { name, surname, username, email, password, avatar, bio, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : []),
        ],
        isDeleted: false,
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Bu e-posta adresi ile bir kullanıcı zaten mevcut');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        name,
        surname,
        username,
        email,
        password: hashedPassword,
        avatar,
        bio,
        role: role || UserRole.USER,
      }
    });

    return this.formatUserResponse(user);
  }

  async findAll(filterDto: UserFilterDto): Promise<PaginatedResponse<UserResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      isActive, 
      isBlocked, 
      includeDeleted = false 
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { surname: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (typeof isBlocked === 'boolean') {
      where.isBlocked = isBlocked;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where })
    ]);

    const formattedUsers = users.map(user => this.formatUserResponse(user));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedUsers,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        isDeleted: false,
      }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return this.formatUserResponse(user);
  }

  async findOneByUuid(uuid: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid,
        isDeleted: false,
        isBlocked: false,
      }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return this.formatUserResponse(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,
        isBlocked: false,
      },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  async findOneById(uuid: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid,
        isDeleted: false,
        isBlocked: false,
      },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  async getHashedUserPass(email: string) {
    const userPassword = await this.prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,
        isBlocked: false,
      },
      select: {
        password: true
      },
    });

    return userPassword;
  }

  async updateProfile(
    id: number, 
    updateUserDto: UpdateUserProfileDto, 
    userId: number, 
    userRole: UserRole
  ): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser || existingUser.isDeleted) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Check permissions - users can only edit their own profile
    if (userRole === UserRole.USER && existingUser.id !== userId) {
      throw new ForbiddenException('Bu kullanıcının profilini düzenleme yetkiniz yok');
    }

    const { username } = updateUserDto;

    // Check username uniqueness if updating username
    if (username && username !== existingUser.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          username,
          id: { not: id },
          isDeleted: false,
        }
      });

      if (existingUsername) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.formatUserResponse(updatedUser);
  }

  async adminUpdateUser(id: number, adminUpdateDto: AdminUpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser || existingUser.isDeleted) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const { username } = adminUpdateDto;

    // Check username uniqueness if updating username
    if (username && username !== existingUser.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          username,
          id: { not: id },
          isDeleted: false,
        }
      });

      if (existingUsername) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: adminUpdateDto,
    });

    return this.formatUserResponse(updatedUser);
  }

  async changePassword(
    userId: number, 
    changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mevcut şifre yanlış');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Yeni şifre mevcut şifre ile aynı olamaz');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Şifre başarıyla değiştirildi' };
  }

  async blockUser(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Süper admin kullanıcısı bloklanamaz');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isBlocked: !user.isBlocked },
    });

    return this.formatUserResponse(updatedUser);
  }

  async deleteUser(id: number, adminId: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Süper admin kullanıcısı silinemez');
    }

    if (user.id === adminId) {
      throw new ForbiddenException('Kendi hesabınızı silemezsiniz');
    }

    // Check if user has dependencies (articles, comments, etc.)
    const [articlesCount, commentsCount] = await Promise.all([
      this.prisma.article.count({ where: { authorId: id } }),
      this.prisma.comment.count({ where: { userId: id } }),
    ]);

    if (articlesCount > 0 || commentsCount > 0) {
      // Soft delete - mark as deleted
      await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
    } else {
      // Hard delete - completely remove
      await this.prisma.user.delete({
        where: { id }
      });
    }

    return { message: 'Kullanıcı başarıyla silindi' };
  }

  async getUserStats(id: number): Promise<{
    articlesCount: number;
    commentsCount: number;
    likesCount: number;
    bookmarksCount: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const [articlesCount, commentsCount, likesCount, bookmarksCount] = await Promise.all([
      this.prisma.article.count({ where: { authorId: id } }),
      this.prisma.comment.count({ where: { userId: id } }),
      this.prisma.like.count({ where: { userId: id } }),
      this.prisma.bookmark.count({ where: { userId: id } }),
    ]);

    return {
      articlesCount,
      commentsCount,
      likesCount,
      bookmarksCount,
    };
  }

  private formatUserResponse(user: any): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}