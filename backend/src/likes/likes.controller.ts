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
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeResponseDto, ArticleLikeStatsDto } from './dto/like-response.dto';
import { LikeFilterDto } from './dto/like-filter.dto';
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

@ApiTags('Likes')
@Controller({ path: 'likes', version: '1' })
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Makale beğen/beğenme',
    description: 'Bir makaleyi beğenir veya beğeniyi kaldırır (toggle).'
  })
  @ApiResponse({
    status: 201,
    description: 'Beğeni durumu başarıyla değiştirildi'
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async toggleLike(
    @Body() createLikeDto: CreateLikeDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ 
    action: 'liked' | 'unliked'; 
    like?: LikeResponseDto;
    likesCount: number;
  }> {
    return this.likesService.toggleLike(createLikeDto, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Beğenileri listele',
    description: 'Beğenileri filtreli ve sayfalı olarak listeler. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Beğeniler başarıyla listelendi',
    type: 'PaginatedResponse<LikeResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'userId', required: false, description: 'Kullanıcı ID' })
  @ApiQuery({ name: 'articleId', required: false, description: 'Makale ID' })
  async findAll(
    @Query() filterDto: LikeFilterDto,
  ): Promise<PaginatedResponse<LikeResponseDto>> {
    return this.likesService.findAll(filterDto);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kullanıcının beğendiklerini getir',
    description: 'Belirtilen kullanıcının beğendiği makaleleri getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcının beğendikleri başarıyla getirildi',
    type: [LikeResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum beğeni sayısı (varsayılan: 50)' })
  async getUserLikes(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: string,
  ): Promise<LikeResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 50;
    return this.likesService.getUserLikes(userId, parsedLimit);
  }

  @Get('my-likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Kendi beğendiklerimi getir',
    description: 'Giriş yapmış kullanıcının beğendiği makaleleri getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Beğenilenler başarıyla getirildi',
    type: [LikeResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum beğeni sayısı (varsayılan: 50)' })
  async getMyLikes(
    @CurrentUser() user: CurrentUserType,
    @Query('limit') limit?: string,
  ): Promise<LikeResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 50;
    return this.likesService.getUserLikes(user.userId, parsedLimit);
  }

  @Get('article/:articleId/stats')
  @ApiOperation({
    summary: 'Makale beğeni istatistikleri',
    description: 'Belirtilen makalenin beğeni sayısını ve kullanıcının beğenip beğenmediğini getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Makale beğeni istatistikleri başarıyla getirildi',
    type: ArticleLikeStatsDto
  })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  async getArticleLikeStats(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user?: CurrentUserType,
  ): Promise<ArticleLikeStatsDto> {
    return this.likesService.getArticleLikeStats(articleId, user?.userId);
  }

  @Get('top-articles')
  @ApiOperation({
    summary: 'En çok beğenilen makaleler',
    description: 'En çok beğenilen makaleleri getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'En çok beğenilen makaleler başarıyla getirildi'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum makale sayısı (varsayılan: 10)' })
  async getTopLikedArticles(
    @Query('limit') limit?: string,
  ): Promise<any[]> {
    const parsedLimit = limit ? parseInt(limit) : 10;
    return this.likesService.getTopLikedArticles(parsedLimit);
  }

  @Delete('article/:articleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Beğeniyi kaldır',
    description: 'Kullanıcının belirtilen makaleye olan beğenisini kaldırır.'
  })
  @ApiResponse({ status: 200, description: 'Beğeni başarıyla kaldırıldı' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Beğeni bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async removeLike(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string; likesCount: number }> {
    return this.likesService.removeLike(articleId, user.userId);
  }
}
