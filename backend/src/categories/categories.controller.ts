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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto, PaginationResponseDto } from '../common/dto/pagination.dto';
import { SuccessResponseDto, ErrorResponseDto } from '../common/dto/response.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Kategori başarıyla oluşturuldu',
    type: SuccessResponseDto<CategoryResponseDto>,
  })
  @ApiResponse({
    status: 409,
    description: 'Kategori zaten mevcut',
    type: ErrorResponseDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kategorileri listele' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sayfa numarası',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Sayfa başına kategori sayısı',
    example: 10,
  })
  @ApiPaginatedResponse(CategoryResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.categoriesService.findAll(paginationDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Aktif kategorileri listele (pagination yok)' })
  @ApiResponse({
    status: 200,
    description: 'Aktif kategoriler başarıyla getirildi',
    type: [CategoryResponseDto],
  })
  async findAllActive() {
    return await this.categoriesService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile kategori getir' })
  @ApiParam({
    name: 'id',
    description: 'Kategori ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori başarıyla getirildi',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori bulunamadı',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Slug ile kategori getir' })
  @ApiParam({
    name: 'slug',
    description: 'Kategori slug',
    example: 'teknoloji',
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori başarıyla getirildi',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori bulunamadı',
    type: ErrorResponseDto,
  })
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kategori güncelle' })
  @ApiParam({
    name: 'id',
    description: 'Kategori ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori başarıyla güncellendi',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori bulunamadı',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Kategori adı zaten kullanımda',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kategori sil' })
  @ApiParam({
    name: 'id',
    description: 'Kategori ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori bulunamadı',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Kategoriye ait makaleler mevcut, silinemez',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return { message: 'Kategori başarıyla silindi' };
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kategori aktif/pasif durumunu değiştir' })
  @ApiParam({
    name: 'id',
    description: 'Kategori ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori durumu başarıyla değiştirildi',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori bulunamadı',
    type: ErrorResponseDto,
  })
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.toggleActive(id);
  }
}