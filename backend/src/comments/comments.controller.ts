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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentFilterDto } from './dto/comment-filter.dto';
import { ModerateCommentDto } from './dto/moderate-comment.dto';
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

@ApiTags('Comments')
@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yeni yorum oluştur',
    description: 'Bir makaleye veya varolan yoruma cevap olarak yeni yorum oluşturur.'
  })
  @ApiResponse({
    status: 201,
    description: 'Yorum başarıyla oluşturuldu',
    type: CommentResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 404, description: 'Makale veya üst yorum bulunamadı' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(createCommentDto, user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Yorumları listele',
    description: 'Yorumları filtreli ve sayfalı olarak listeler.'
  })
  @ApiResponse({
    status: 200,
    description: 'Yorumlar başarıyla listelendi',
    type: 'PaginatedResponse<CommentResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'articleId', required: false, description: 'Makale ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Kullanıcı ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Yorum durumu' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Üst yorum ID' })
  @ApiQuery({ name: 'onlyParents', required: false, description: 'Sadece ana yorumlar' })
  async findAll(
    @Query() filterDto: CommentFilterDto,
  ): Promise<PaginatedResponse<CommentResponseDto>> {
    return this.commentsService.findAll(filterDto);
  }

  @Get('article/:articleId')
  @ApiOperation({
    summary: 'Makaleye ait yorumları getir',
    description: 'Belirtilen makaleye ait onaylanmış yorumları getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Makale yorumları başarıyla getirildi',
    type: [CommentResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum yorum sayısı (varsayılan: 50)' })
  async getCommentsByArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query('limit') limit?: string,
  ): Promise<CommentResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 50;
    return this.commentsService.getCommentsByArticle(articleId, parsedLimit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Yorum detayını getir',
    description: 'ID ile belirtilen yorumun detaylarını getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Yorum detayları başarıyla getirildi',
    type: CommentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CommentResponseDto> {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yorum güncelle',
    description: 'Kullanıcı kendi yorumunu günceller (15 dakika içinde).'
  })
  @ApiResponse({
    status: 200,
    description: 'Yorum başarıyla güncellendi',
    type: CommentResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim veya süre dolmuş' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<CommentResponseDto> {
    return this.commentsService.update(id, updateCommentDto, user.userId, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yorum sil',
    description: 'Kullanıcı kendi yorumunu siler (cevabı yoksa).'
  })
  @ApiResponse({ status: 200, description: 'Yorum başarıyla silindi' })
  @ApiResponse({ status: 400, description: 'Cevapları olan yorumlar silinemez' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string }> {
    await this.commentsService.remove(id, user.userId, user.role);
    return { message: 'Yorum başarıyla silindi' };
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yorum moderasyonu',
    description: 'Yorumu onayla, reddet veya spam olarak işaretle. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Yorum durumu başarıyla güncellendi',
    type: CommentResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body() moderateCommentDto: ModerateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.moderate(id, moderateCommentDto);
  }
}
