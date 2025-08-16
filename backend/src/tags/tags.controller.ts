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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto, TagWithArticlesDto } from './dto/tag-response.dto';
import { TagFilterDto } from './dto/tag-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tags')
@Controller({ path: 'tags', version: '1' })
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Yeni tag oluştur',
    description: 'Yeni bir tag oluşturur. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 201,
    description: 'Tag başarıyla oluşturuldu',
    type: TagResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 409, description: 'Bu isimde tag zaten mevcut' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Tagları listele',
    description: 'Tagları filtreli ve sayfalı olarak listeler.'
  })
  @ApiResponse({
    status: 200,
    description: 'Taglar başarıyla listelendi',
    type: 'PaginatedResponse<TagResponseDto>'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'limit', required: false, description: 'Sayfa başına öğe sayısı' })
  @ApiQuery({ name: 'search', required: false, description: 'Tag adında arama terimi' })
  @ApiQuery({ name: 'sortByArticleCount', required: false, description: 'Makale sayısına göre sırala' })
  async findAll(
    @Query() filterDto: TagFilterDto,
  ): Promise<PaginatedResponse<TagResponseDto>> {
    return this.tagsService.findAll(filterDto);
  }

  @Get('popular')
  @ApiOperation({
    summary: 'Popüler tagları getir',
    description: 'En çok kullanılan tagları getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Popüler taglar başarıyla getirildi',
    type: [TagResponseDto]
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum tag sayısı (varsayılan: 10)' })
  async getPopularTags(
    @Query('limit') limit?: string,
  ): Promise<TagResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 10;
    return this.tagsService.getPopularTags(parsedLimit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Tag arama',
    description: 'Tag adında arama yapar.'
  })
  @ApiResponse({
    status: 200,
    description: 'Arama sonuçları başarıyla getirildi',
    type: [TagResponseDto]
  })
  @ApiQuery({ name: 'q', required: true, description: 'Arama terimi' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maksimum sonuç sayısı (varsayılan: 10)' })
  async searchTags(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ): Promise<TagResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit) : 10;
    return this.tagsService.searchTags(query, parsedLimit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tag istatistikleri',
    description: 'Genel tag istatistiklerini getirir. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Tag istatistikleri başarıyla getirildi'
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  async getTagStats(): Promise<{
    totalTags: number;
    tagsWithArticles: number;
    mostUsedTag: TagResponseDto | null;
    averageArticlesPerTag: number;
  }> {
    return this.tagsService.getTagStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Tag detayını getir',
    description: 'ID ile belirtilen tagın detaylarını getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Tag detayları başarıyla getirildi',
    type: TagResponseDto
  })
  @ApiResponse({ status: 404, description: 'Tag bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TagResponseDto> {
    return this.tagsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Slug ile tag detayını getir',
    description: 'Slug ile belirtilen tagın detaylarını ve ilişkili makalelerini getirir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Tag detayları ve makaleleri başarıyla getirildi',
    type: TagWithArticlesDto
  })
  @ApiResponse({ status: 404, description: 'Tag bulunamadı' })
  async findBySlug(@Param('slug') slug: string): Promise<TagWithArticlesDto> {
    return this.tagsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tag güncelle',
    description: 'Belirtilen tagı günceller. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({
    status: 200,
    description: 'Tag başarıyla güncellendi',
    type: TagResponseDto
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Tag bulunamadı' })
  @ApiResponse({ status: 409, description: 'Bu isimde tag zaten mevcut' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    return this.tagsService.update(id, updateTagDto);
  }

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Çoklu tag silme',
    description: 'Belirtilen tagları toplu olarak siler. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Taglar başarıyla silindi',
    schema: {
      type: 'object',
      properties: {
        deletedCount: { type: 'number' },
        failedIds: { type: 'array', items: { type: 'number' } },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @HttpCode(HttpStatus.OK)
  async bulkDelete(@Body('ids') ids: number[]): Promise<{
    deletedCount: number;
    failedIds: number[];
    message: string;
  }> {
    return this.tagsService.bulkDelete(ids);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tag sil',
    description: 'Belirtilen tagı siler. Sadece editörler ve yöneticiler kullanabilir.'
  })
  @ApiResponse({ status: 200, description: 'Tag başarıyla silindi' })
  @ApiResponse({ status: 400, description: 'Tag makalelerde kullanıldığı için silinemez' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme gerekli' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Tag bulunamadı' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tagsService.remove(id);
    return { message: 'Tag başarıyla silindi' };
  }
}
