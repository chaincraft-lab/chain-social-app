import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

interface CurrentUserType {
  userId: number;  // Internal ID from JWT
  uuid: string;    // UUID from JWT  
  email: string;
  name: string;
  surname: string;
  username: string;
  role: UserRole;
}

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yeni kullanıcı oluştur',
    description: 'Yeni bir kullanıcı oluşturur. Sadece admin ve super admin tarafından kullanılabilir.'
  })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla oluşturuldu',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 409, description: 'Kullanıcı zaten mevcut' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcıları listele',
    description: 'Kullanıcıları filtreli ve sayfalı olarak listeler.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcılar başarıyla listelendi',
    type: 'PaginatedResponse<UserResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'search', required: false, description: 'Arama terimi' })
  @ApiQuery({ name: 'role', required: false, description: 'Kullanıcı rolü' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Aktif durumu' })
  @ApiQuery({ name: 'isBlocked', required: false, description: 'Bloklu durumu' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Silinen kullanıcıları dahil et' })
  async findAll(
    @Query() filterDto: UserFilterDto,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    return this.usersService.findAll(filterDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kendi profilini görüntüle',
    description: 'Giriş yapmış kullanıcının kendi profil bilgilerini getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Profil bilgileri başarıyla getirildi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  async getProfile(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
    return this.usersService.findOne(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcı detayını getir',
    description: 'ID ile belirtilen kullanıcının detaylarını getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı detayları başarıyla getirildi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Get('uuid/:uuid')
  @ApiOperation({
    summary: 'UUID ile kullanıcı detayını getir',
    description: 'UUID ile belirtilen kullanıcının detaylarını getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı detayları başarıyla getirildi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async findByUuid(@Param('uuid') uuid: string): Promise<UserResponseDto> {
    return this.usersService.findOneByUuid(uuid);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcı istatistiklerini getir',
    description: 'Kullanıcının makale, yorum, beğeni ve bookmark istatistiklerini getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'İstatistikler başarıyla getirildi'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async getUserStats(@Param('id', ParseIntPipe) id: number): Promise<{
    articlesCount: number;
    commentsCount: number;
    likesCount: number;
    bookmarksCount: number;
  }> {
    return this.usersService.getUserStats(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Profil güncelle',
    description: 'Giriş yapmış kullanıcının kendi profil bilgilerini günceller.'
  })
  @ApiResponse({
    status: 200,
    description: 'Profil başarıyla güncellendi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 409, description: 'Kullanıcı adı zaten kullanılıyor' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserProfileDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(user.userId, updateUserDto, user.userId, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcı güncelle (Admin)',
    description: 'Admin tarafından kullanıcı bilgilerini günceller.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla güncellendi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  @ApiResponse({ status: 409, description: 'Kullanıcı adı zaten kullanılıyor' })
  async adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminUpdateDto: AdminUpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.adminUpdateUser(id, adminUpdateDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Şifre değiştir',
    description: 'Giriş yapmış kullanıcının şifresini değiştirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Şifre başarıyla değiştirildi'
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri veya aynı şifre' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli veya mevcut şifre yanlış' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(user.userId, changePasswordDto);
  }

  @Patch(':id/block')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcı blokla/blokunu kaldır',
    description: 'Kullanıcının blok durumunu değiştirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı blok durumu başarıyla değiştirildi',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim veya super admin bloklanamaz' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async blockUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.blockUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcı sil',
    description: 'Kullanıcıyı siler. Bağımlılıklar varsa soft delete, yoksa hard delete yapar.'
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla silindi' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim, super admin silinemez veya kendi hesabını silemezsiniz' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(id, user.userId);
  }
}