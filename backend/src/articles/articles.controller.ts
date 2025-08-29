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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
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

@ApiTags('Articles')
@Controller({ path: 'articles', version: '1' })
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.AUTHOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Yeni makale oluştur',
    description: 'Yeni bir makale oluşturur. Sadece yetkilendirilmiş kullanıcılar tarafından kullanılabilir.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Makale başarıyla oluşturuldu',
    type: ArticleResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Kategori veya etiket bulunamadı' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<ArticleResponseDto> {
    console.log('Creating article with data:', createArticleDto, 'by user:', user);
    return this.articlesService.create(createArticleDto, user.userId);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Makaleleri listele',
    description: 'Aktif makaleleri filtreli ve sayfalı olarak listeler. Kullanıcı giriş yapmışsa beğeni ve bookmark durumunu da döner.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makaleler başarıyla listelendi',
    type: 'PaginatedResponse<ArticleResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Kategori ID' })
  @ApiQuery({ name: 'categorySlug', required: false, description: 'Kategori slug' })
  @ApiQuery({ name: 'tagIds', required: false, description: 'Etiket ID listesi (virgülle ayrılmış)' })
  @ApiQuery({ name: 'tagSlug', required: false, description: 'Etiket slug' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Yazar ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Arama terimi' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Öne çıkan makaleler' })
  @ApiQuery({ name: 'isBreaking', required: false, description: 'Son dakika haberleri' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sıralama alanı' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sıralama yönü' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Başlangıç tarihi' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Bitiş tarihi' })
  async findAll(
    @Query() filterDto: ArticleFilterDto,
    @CurrentUser() user?: CurrentUserType,
  ): Promise<PaginatedResponse<ArticleResponseDto>> {
    console.log('user:', user);
    const userId = user?.userId || null;
    return this.articlesService.findAll(filterDto, userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Admin için tüm makaleleri listele',
    description: 'Admin paneli için tüm makaleleri (aktif/pasif) filtreli ve sayfalı olarak listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makaleler başarıyla listelendi',
    type: 'PaginatedResponse<ArticleResponseDto>'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Kategori ID' })
  @ApiQuery({ name: 'categorySlug', required: false, description: 'Kategori slug' })
  @ApiQuery({ name: 'tagIds', required: false, description: 'Etiket ID listesi (virgülle ayrılmış)' })
  @ApiQuery({ name: 'tagSlug', required: false, description: 'Etiket slug' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Yazar ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Arama terimi' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Öne çıkan makaleler' })
  @ApiQuery({ name: 'isBreaking', required: false, description: 'Son dakika haberleri' })
  @ApiQuery({ name: 'status', required: false, description: 'Makale durumu (PUBLISHED, DRAFT)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sıralama alanı' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sıralama yönü' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Başlangıç tarihi' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Bitiş tarihi' })
  async findAllForAdmin(
    @Query() filterDto: ArticleFilterDto,
  ): Promise<PaginatedResponse<ArticleResponseDto>> {
    return this.articlesService.findAllForAdmin(filterDto);
  }

  @Get('featured')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Öne çıkan makaleleri getir',
    description: 'Öne çıkan makaleleri listeler. Kullanıcı giriş yapmışsa beğeni ve bookmark durumunu da döner.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Öne çıkan makaleler başarıyla getirildi',
    type: 'PaginatedResponse<ArticleResponseDto>'
  })
  async findFeatured(
    @Query() filterDto: ArticleFilterDto,
    @CurrentUser() user?: CurrentUserType,
  ): Promise<PaginatedResponse<ArticleResponseDto>> {
    const userId = user?.userId || null;
    return this.articlesService.findAll({ ...filterDto, isFeatured: true }, userId);
  }

  @Get('breaking')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Son dakika haberlerini getir',
    description: 'Son dakika haberlerini listeler. Kullanıcı giriş yapmışsa beğeni ve bookmark durumunu da döner.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Son dakika haberleri başarıyla getirildi',
    type: 'PaginatedResponse<ArticleResponseDto>'
  })
  async findBreaking(
    @Query() filterDto: ArticleFilterDto,
    @CurrentUser() user?: CurrentUserType,
  ): Promise<PaginatedResponse<ArticleResponseDto>> {
    const userId = user?.userId || null;
    return this.articlesService.findAll({ ...filterDto, isBreaking: true }, userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Makale detayını getir',
    description: 'ID ile belirtilen makalenin detaylarını getirir ve görüntülenme sayısını artırır.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makale detayları başarıyla getirildi',
    type: ArticleResponseDto
  })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ArticleResponseDto> {
    return this.articlesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Slug ile makale detayını getir',
    description: 'Slug ile belirtilen makalenin detaylarını getirir ve görüntülenme sayısını artırır.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makale detayları başarıyla getirildi',
    type: ArticleResponseDto
  })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  async findBySlug(@Param('slug') slug: string): Promise<ArticleResponseDto> {
    return this.articlesService.findBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ 
    summary: 'İlgili makaleleri getir',
    description: 'Belirtilen makaleyle aynı kategorideki diğer makaleleri getirir.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'İlgili makaleler başarıyla getirildi',
    type: [ArticleResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum makale sayısı (varsayılan: 5)' })
  async getRelatedArticles(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ): Promise<ArticleResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 5;
    return this.articlesService.getRelatedArticles(id, parsedLimit);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.AUTHOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Makale güncelle',
    description: 'Belirtilen makaleyi günceller. Sadece makale sahibi veya yöneticiler güncelleyebilir.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makale başarıyla güncellendi',
    type: ArticleResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.update(id, updateArticleDto, user.userId, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.AUTHOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Makale sil',
    description: 'Belirtilen makaleyi siler. Sadece makale sahibi veya yöneticiler silebilir.'
  })
  @ApiResponse({ status: 200, description: 'Makale başarıyla silindi' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  @ApiResponse({ status: 409, description: 'Makale silinemiyor (bağımlılıklar var)' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ message: string }> {
    await this.articlesService.remove(id, user.userId, user.role);
    return { message: 'Makale başarıyla silindi' };
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Makale aktiflik durumunu değiştir',
    description: 'Belirtilen makalenin aktiflik durumunu değiştirir. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Makale aktiflik durumu başarıyla değiştirildi',
    type: ArticleResponseDto
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.toggleActive(id);
  }
}