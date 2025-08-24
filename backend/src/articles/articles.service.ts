import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleFilterDto, DateRange } from './dto/article-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { generateSlug } from '../common/utils/slug.util';
import { UserRole, ArticleStatus, CommentStatus } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private handleDateRangeFilter(where: any, dateRange: DateRange, startDate?: string, endDate?: string) {
    if (dateRange) {
      const now = new Date();
      let calculatedStartDate: Date;
      let calculatedEndDate: Date = now;

      switch (dateRange) {
        case DateRange.TODAY:
          calculatedStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          calculatedEndDate = new Date(calculatedStartDate.getTime() + 24 * 60 * 60 * 1000 - 1);
          break;
        case DateRange.WEEK:
          calculatedStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case DateRange.MONTH:
          calculatedStartDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case DateRange.YEAR:
          calculatedStartDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
      }

      where.createdAt = {
        gte: calculatedStartDate,
        lte: calculatedEndDate
      };
    } else {
      // Handle explicit startDate and endDate
      if (startDate) {
        where.publishedAt = { 
          ...where.publishedAt,
          gte: new Date(startDate)
        };
      }

      if (endDate) {
        where.publishedAt = {
          ...where.publishedAt,
          lte: new Date(endDate + 'T23:59:59.999Z')
        };
      }
    }
  }

  async create(createArticleDto: CreateArticleDto, authorId: number): Promise<ArticleResponseDto> {
    const { title, excerpt, content, image, categoryId, tagIds, isFeatured, isBreaking } = createArticleDto;

    // Verify category exists
    const category = await this.prisma.category.findFirst({
      where: { 
        id: categoryId,
        isActive: true 
      }
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    // Verify tags exist if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: { 
          id: { in: tagIds }
        }
      });

      if (existingTags.length !== tagIds.length) {
        throw new NotFoundException('Bir veya daha fazla etiket bulunamadı');
      }
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const existingSlugs = await this.prisma.article.findMany({
      where: { 
        slug: { startsWith: baseSlug }
      },
      select: { slug: true },
    }).then(articles => articles.map(a => a.slug));

    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create article with relations
    const article = await this.prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        status: ArticleStatus.PUBLISHED,
        isFeatured: isFeatured || false,
        isBreaking: isBreaking || false,
        categoryId,
        authorId,
        publishedAt: new Date(),
        tags: tagIds ? {
          create: tagIds.map(tagId => ({
            tagId
          }))
        } : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    return this.formatArticleResponse(article);
  }

  async findAll(filterDto: ArticleFilterDto): Promise<PaginatedResponse<ArticleResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      categoryId, 
      categorySlug,
      tagIds,
      tagSlug,
      authorId,
      search,
      isFeatured,
      isBreaking,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      dateRange
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
        isActive: true,
      };
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds }
        }
      };
    }

    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug
          }
        }
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }

    if (typeof isBreaking === 'boolean') {
      where.isBreaking = isBreaking;
    }

    // Handle date filtering
    this.handleDateRangeFilter(where, dateRange, startDate, endDate);

    // Build order clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true,
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
            }
          },
          _count: {
            select: {
              articleLikes: true,
              comments: { where: { status: CommentStatus.APPROVED } },
            }
          }
        }
      }),
      this.prisma.article.count({ where })
    ]);

    const formattedArticles = articles.map(article => this.formatArticleResponse(article));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedArticles,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findFirst({
      where: { 
        id,
        status: ArticleStatus.PUBLISHED 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Increment view count
    await this.prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return this.formatArticleResponse(article);
  }

  async findBySlug(slug: string): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findFirst({
      where: { 
        slug,
        status: ArticleStatus.PUBLISHED 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Increment view count
    await this.prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    return this.formatArticleResponse(article);
  }

  async update(
    id: number, 
    updateArticleDto: UpdateArticleDto,
    userId: number,
    userRole: UserRole
  ): Promise<ArticleResponseDto> {
    const existingArticle = await this.prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Check permissions
    if (userRole === UserRole.USER && existingArticle.authorId !== userId) {
      throw new ForbiddenException('Bu makaleyi düzenleme yetkiniz yok');
    }

    const { title, excerpt, content, image, categoryId, tagIds, isFeatured, isBreaking } = updateArticleDto;

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (title && title !== existingArticle.title) {
      const baseSlug = generateSlug(title);
      const existingSlugs = await this.prisma.article.findMany({
        where: { 
          slug: { startsWith: baseSlug },
          id: { not: id }
        },
        select: { slug: true },
      }).then(articles => articles.map(a => a.slug));

      slug = baseSlug;
      let counter = 1;
      while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Verify category if provided
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { 
          id: categoryId,
          isActive: true 
        }
      });

      if (!category) {
        throw new NotFoundException('Kategori bulunamadı');
      }
    }

    // Verify tags if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: { 
          id: { in: tagIds }
        }
      });

      if (existingTags.length !== tagIds.length) {
        throw new NotFoundException('Bir veya daha fazla etiket bulunamadı');
      }
    }

    // Update article
    const updateData: any = {
      ...(title && { title }),
      slug,
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(image !== undefined && { image }),
      ...(typeof isFeatured === 'boolean' && { isFeatured }),
      ...(typeof isBreaking === 'boolean' && { isBreaking }),
      ...(categoryId && { categoryId }),
    };

    // Handle tag updates
    if (tagIds !== undefined) {
      await this.prisma.articleTag.deleteMany({
        where: { articleId: id }
      });

      if (tagIds.length > 0) {
        updateData.tags = {
          create: tagIds.map(tagId => ({
            tagId
          }))
        };
      }
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    return this.formatArticleResponse(article);
  }

  async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Check permissions
    if (userRole === UserRole.USER && article.authorId !== userId) {
      throw new ForbiddenException('Bu makaleyi silme yetkiniz yok');
    }

    // Check if article has dependencies
    const [likesCount, commentsCount, bookmarksCount] = await Promise.all([
      this.prisma.like.count({ where: { articleId: id } }),
      this.prisma.comment.count({ where: { articleId: id } }),
      this.prisma.bookmark.count({ where: { articleId: id } }),
    ]);

    if (likesCount > 0 || commentsCount > 0 || bookmarksCount > 0) {
      throw new ConflictException('Bu makaleye ait beğeniler, yorumlar veya yer imleri olduğu için silinemez');
    }

    await this.prisma.article.delete({
      where: { id }
    });
  }

  async toggleActive(id: number): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    const newStatus = article.status === ArticleStatus.PUBLISHED ? ArticleStatus.DRAFT : ArticleStatus.PUBLISHED;

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: { status: newStatus },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    return this.formatArticleResponse(updatedArticle);
  }

  async getRelatedArticles(id: number, limit: number = 5): Promise<ArticleResponseDto[]> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { categoryId: true }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    const relatedArticles = await this.prisma.article.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: id },
        status: ArticleStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        _count: {
          select: {
            articleLikes: true,
            comments: { where: { status: CommentStatus.APPROVED } },
          }
        }
      }
    });

    return relatedArticles.map(article => this.formatArticleResponse(article));
  }

  async findAllForAdmin(filterDto: ArticleFilterDto): Promise<PaginatedResponse<ArticleResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      categoryId, 
      categorySlug,
      tagIds,
      tagSlug,
      authorId,
      search,
      isFeatured,
      isBreaking,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      dateRange
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause - admin can see all statuses
    const where: any = {};

    // If status is provided, filter by it; otherwise show all
    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
        isActive: true,
      };
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds }
        }
      };
    }

    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug
          }
        }
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }

    if (typeof isBreaking === 'boolean') {
      where.isBreaking = isBreaking;
    }

    // Handle date filtering
    this.handleDateRangeFilter(where, dateRange, startDate, endDate);

    // Build order clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true,
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
            }
          },
          _count: {
            select: {
              articleLikes: true,
              comments: { where: { status: CommentStatus.APPROVED } },
            }
          }
        }
      }),
      this.prisma.article.count({ where })
    ]);

    const formattedArticles = articles.map(article => this.formatArticleResponse(article));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedArticles,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  private formatArticleResponse(article: any): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      isFeatured: article.isFeatured,
      isBreaking: article.isBreaking,
      isActive: article.status === ArticleStatus.PUBLISHED,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.category,
      author: article.author,
      tags: article.tags?.map((articleTag: any) => articleTag.tag) || [],
      viewCount: article.views,
      likeCount: article._count?.articleLikes || 0,
      commentCount: article._count?.comments || 0,
    };
  }
}