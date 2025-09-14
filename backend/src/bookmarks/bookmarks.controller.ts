import {
  Controller,
  Get,
  Post,
  Body,
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
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { BookmarkFilterDto } from './dto/bookmark-filter.dto';
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

@ApiTags('Bookmarks')
@Controller({ path: 'bookmarks', version: '1' })
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Makale kaydet/kaydetme',
    description: 'Bir makaleyi kaydeder veya kaydedilmiş olanı kaldırır (toggle).'
  })
  @ApiResponse({
    status: 201,
    description: 'Bookmark durumu başarıyla değiştirildi'
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async toggleBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ 
    action: 'bookmarked' | 'unbookmarked'; 
    bookmark?: BookmarkResponseDto;
  }> {
    return this.bookmarksService.toggleBookmark(createBookmarkDto, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Bookmarkları listele',
    description: 'Bookmarkları filtreli ve sayfalı olarak listeler. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmarklar başarıyla listelendi',
    type: 'PaginatedResponse<BookmarkResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'userId', required: false, description: 'Kullanıcı ID' })
  @ApiQuery({ name: 'articleId', required: false, description: 'Makale ID' })
  async findAll(
    @Query() filterDto: BookmarkFilterDto,
  ): Promise<PaginatedResponse<BookmarkResponseDto>> {
    return this.bookmarksService.findAll(filterDto);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcının kaydettiği makaleleri getir',
    description: 'Belirtilen kullanıcının kaydettiği makaleleri getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcının kaydettikleri başarıyla getirildi',
    type: [BookmarkResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum bookmark sayısı (varsayılan: 50)' })
  async getUserBookmarks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: string,
  ): Promise<BookmarkResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 50;
    return this.bookmarksService.getUserBookmarks(userId, parsedLimit);
  }

  @Get('my-bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kendi kaydettiğim makaleleri getir',
    description: 'Giriş yapmış kullanıcının kaydettiği makaleleri sayfalı olarak getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kaydedilenler başarıyla getirildi',
    type: 'PaginatedResponse<BookmarkResponseDto>'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası (varsayılan: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı (varsayılan: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sıralama alanı (varsayılan: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sıralama yönü (varsayılan: desc)' })
  async getMyBookmarks(
    @CurrentUser() user: CurrentUserType,
    @Query() filterDto: BookmarkFilterDto,
  ): Promise<PaginatedResponse<BookmarkResponseDto>> {
    return this.bookmarksService.getUserBookmarksPaginated(user.userId, filterDto);
  }

  @Get('article/:articleId/check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Makale bookmark durumunu kontrol et',
    description: 'Kullanıcının belirtilen makaleyi kaydedip kaydetmediğini kontrol eder.'
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark durumu başarıyla kontrol edildi'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  async isBookmarked(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ isBookmarked: boolean }> {
    return this.bookmarksService.isBookmarked(articleId, user.userId);
  }

  @Get('most-bookmarked')
  @ApiOperation({
    summary: 'En çok kaydedilen makaleler',
    description: 'En çok kaydedilen makaleleri getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'En çok kaydedilen makaleler başarıyla getirildi'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum makale sayısı (varsayılan: 10)' })
  async getMostBookmarkedArticles(
    @Query('limit') limit?: string,
  ): Promise<any[]> {
    const parsedLimit = limit ? parseInt(limit) : 10;
    return this.bookmarksService.getMostBookmarkedArticles(parsedLimit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Bookmark istatistikleri',
    description: 'Genel bookmark istatistiklerini getirir. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark istatistikleri başarıyla getirildi'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  async getBookmarkStats(): Promise<{
    totalBookmarks: number;
    totalBookmarkedArticles: number;
    topBookmarkedArticle: any;
  }> {
    return this.bookmarksService.getBookmarkStats();
  }

  @Delete('article/:articleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Bookmark kaldır',
    description: 'Kullanıcının belirtilen makaleye olan bookmark\'ını kaldırır.'
  })
  @ApiResponse({ status: 200, description: 'Bookmark başarıyla kaldırıldı' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Bookmark bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async removeBookmark(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string }> {
    return this.bookmarksService.removeBookmark(articleId, user.userId);
  }
}
