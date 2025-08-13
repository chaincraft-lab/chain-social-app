import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { generateSlug, generateUniqueSlug } from '../common/utils/slug.util';
import { PaginationDto, PaginationResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { name, description, color, icon } = createCategoryDto;

    // Generate slug from name
    const baseSlug = generateSlug(name);
    
    // Check if slug already exists and generate unique one if needed
    const existingSlugs = await this.prisma.category.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    }).then(categories => categories.map(c => c.slug));

    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    // Check if name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('Bu isimde bir kategori zaten mevcut');
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
        icon,
      },
    });

    return this.mapToResponseDto(category);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResponseDto<CategoryResponseDto>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.category.count({
        where: { isActive: true },
      }),
    ]);

    const categoriesDto = categories.map(category => ({
      ...this.mapToResponseDto(category),
      articleCount: category._count.articles,
    }));

    return new PaginationResponseDto(categoriesDto, total, page, limit);
  }

  async findAllActive(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map(category => ({
      ...this.mapToResponseDto(category),
      articleCount: category._count.articles,
    }));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return {
      ...this.mapToResponseDto(category),
      articleCount: category._count.articles,
    };
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return {
      ...this.mapToResponseDto(category),
      articleCount: category._count.articles,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    const { name, description, color, icon } = updateCategoryDto;

    // If name is being updated, generate new slug
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      // Check if new name already exists
      const categoryWithSameName = await this.prisma.category.findUnique({
        where: { name },
      });

      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new ConflictException('Bu isimde bir kategori zaten mevcut');
      }

      // Generate new slug
      const baseSlug = generateSlug(name);
      const existingSlugs = await this.prisma.category.findMany({
        where: { 
          slug: { startsWith: baseSlug },
          id: { not: id },
        },
        select: { slug: true },
      }).then(categories => categories.map(c => c.slug));

      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        color,
        icon,
      },
    });

    return this.mapToResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    if (category._count.articles > 0) {
      throw new ConflictException('Bu kategoriye ait makaleler olduğu için silinemez');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  async toggleActive(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });

    return this.mapToResponseDto(updatedCategory);
  }

  private mapToResponseDto(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}