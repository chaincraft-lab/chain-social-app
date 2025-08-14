import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto, TagWithArticlesDto } from './dto/tag-response.dto';
import { TagFilterDto } from './dto/tag-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    const { name } = createTagDto;

    // Check if tag with same name already exists
    const existingTag = await this.prisma.tag.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existingTag) {
      throw new ConflictException('Bu isimde bir tag zaten mevcut');
    }

    // Generate unique slug
    const baseSlug = generateSlug(name);
    const existingSlugs = await this.prisma.tag.findMany({
      where: { 
        slug: { startsWith: baseSlug }
      },
      select: { slug: true },
    }).then(tags => tags.map(t => t.slug));

    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tag = await this.prisma.tag.create({
      data: {
        name,
        slug,
      }
    });

    return this.formatTagResponse(tag, 0);
  }

  async findAll(filterDto: TagFilterDto): Promise<PaginatedResponse<TagResponseDto>> {
    const { 
      page = 1, 
      limit = 20, 
      search,
      sortByArticleCount = false
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortByArticleCount) {
      orderBy = { articles: { _count: 'desc' } };
    }

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { articles: true }
          }
        }
      }),
      this.prisma.tag.count({ where })
    ]);

    const formattedTags = tags.map(tag => 
      this.formatTagResponse(tag, tag._count.articles)
    );

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedTags,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async findOne(id: number): Promise<TagResponseDto> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      throw new NotFoundException('Tag bulunamadı');
    }

    return this.formatTagResponse(tag, tag._count.articles);
  }

  async findBySlug(slug: string): Promise<TagWithArticlesDto> {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        articles: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                image: true,
                publishedAt: true,
                status: true,
                category: {
                  select: {
                    name: true,
                  }
                },
                author: {
                  select: {
                    name: true,
                    surname: true,
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      throw new NotFoundException('Tag bulunamadı');
    }

    const articles = (tag as any).articles
      .filter((articleTag: any) => articleTag.article && articleTag.article.status === 'PUBLISHED') // Filter published articles only
      .map((articleTag: any) => ({
        id: articleTag.article.id,
        title: articleTag.article.title,
        slug: articleTag.article.slug,
        excerpt: articleTag.article.excerpt,
        image: articleTag.article.image,
        publishedAt: articleTag.article.publishedAt,
        categoryName: articleTag.article.category.name,
        authorName: `${articleTag.article.author.name} ${articleTag.article.author.surname}`,
      }));

    return {
      ...this.formatTagResponse(tag, (tag as any)._count.articles),
      articles,
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    const existingTag = await this.prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      throw new NotFoundException('Tag bulunamadı');
    }

    const { name } = updateTagDto;

    // Check if tag with same name already exists (excluding current tag)
    if (name && name !== existingTag.name) {
      const duplicateTag = await this.prisma.tag.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive'
          },
          id: { not: id }
        }
      });

      if (duplicateTag) {
        throw new ConflictException('Bu isimde bir tag zaten mevcut');
      }
    }

    // Generate new slug if name is changing
    let updateData: any = updateTagDto;
    if (name && name !== existingTag.name) {
      const baseSlug = generateSlug(name);
      const existingSlugs = await this.prisma.tag.findMany({
        where: { 
          slug: { startsWith: baseSlug },
          id: { not: id }
        },
        select: { slug: true },
      }).then(tags => tags.map(t => t.slug));

      let slug = baseSlug;
      let counter = 1;
      while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData = { ...updateTagDto, slug };
    }

    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    return this.formatTagResponse(updatedTag, updatedTag._count.articles);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      throw new NotFoundException('Tag bulunamadı');
    }

    // Check if tag has associated articles
    if (tag._count.articles > 0) {
      throw new BadRequestException('Bu tag makalelerde kullanıldığı için silinemez');
    }

    await this.prisma.tag.delete({
      where: { id }
    });
  }

  async getPopularTags(limit: number = 10): Promise<TagResponseDto[]> {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: {
        articles: { _count: 'desc' }
      },
      take: limit,
    });

    return tags
      .filter(tag => tag._count.articles > 0) // Only tags with articles
      .map(tag => this.formatTagResponse(tag, tag._count.articles));
  }

  async getTagStats(): Promise<{
    totalTags: number;
    tagsWithArticles: number;
    mostUsedTag: TagResponseDto | null;
    averageArticlesPerTag: number;
  }> {
    const [totalTags, tagsWithArticles, mostUsedTag, allTagsWithCounts] = await Promise.all([
      this.prisma.tag.count(),
      this.prisma.tag.count({
        where: {
          articles: {
            some: {}
          }
        }
      }),
      this.prisma.tag.findFirst({
        include: {
          _count: {
            select: { articles: true }
          }
        },
        orderBy: {
          articles: { _count: 'desc' }
        }
      }),
      this.prisma.tag.findMany({
        include: {
          _count: {
            select: { articles: true }
          }
        }
      })
    ]);

    const totalArticleTagRelations = allTagsWithCounts.reduce(
      (sum, tag) => sum + tag._count.articles, 
      0
    );
    const averageArticlesPerTag = totalTags > 0 ? totalArticleTagRelations / totalTags : 0;

    return {
      totalTags,
      tagsWithArticles,
      mostUsedTag: mostUsedTag ? this.formatTagResponse(mostUsedTag, mostUsedTag._count.articles) : null,
      averageArticlesPerTag: Math.round(averageArticlesPerTag * 100) / 100,
    };
  }

  async searchTags(query: string, limit: number = 10): Promise<TagResponseDto[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: [
        { articles: { _count: 'desc' } },
        { name: 'asc' }
      ],
      take: limit,
    });

    return tags.map(tag => this.formatTagResponse(tag, tag._count.articles));
  }

  private formatTagResponse(tag: any, articlesCount: number): TagResponseDto {
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.createdAt,
      articlesCount,
    };
  }
}
