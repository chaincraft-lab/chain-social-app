import { 
  Injectable, 
  NotFoundException, 
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeResponseDto, ArticleLikeStatsDto } from './dto/like-response.dto';
import { LikeFilterDto } from './dto/like-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(createLikeDto: CreateLikeDto, userId: number): Promise<{ 
    action: 'liked' | 'unliked'; 
    like?: LikeResponseDto;
    likesCount: number;
  }> {
    const { articleId } = createLikeDto;

    // Verify article exists and is published
    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        status: 'PUBLISHED',
      }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Check if user already liked this article
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        }
      }
    });

    if (existingLike) {
      // Unlike - remove the like
      await this.prisma.like.delete({
        where: { id: existingLike.id }
      });

      // Update article likes count
      await this.prisma.article.update({
        where: { id: articleId },
        data: { likes: { decrement: 1 } }
      });

      const likesCount = await this.prisma.like.count({
        where: { articleId }
      });

      return { 
        action: 'unliked',
        likesCount 
      };
    } else {
      // Like - create new like
      const like = await this.prisma.like.create({
        data: {
          userId,
          articleId,
        },
        include: {
          user: {
            select: {
              id: true,
              uuid: true,
              name: true,
              surname: true,
              username: true,
              avatar: true,
            }
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
            }
          }
        }
      });

      // Update article likes count
      await this.prisma.article.update({
        where: { id: articleId },
        data: { likes: { increment: 1 } }
      });

      const likesCount = await this.prisma.like.count({
        where: { articleId }
      });

      return { 
        action: 'liked',
        like: this.formatLikeResponse(like),
        likesCount 
      };
    }
  }

  async findAll(filterDto: LikeFilterDto): Promise<PaginatedResponse<LikeResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      userId, 
      articleId 
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (articleId) {
      where.articleId = articleId;
    }

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              uuid: true,
              name: true,
              surname: true,
              username: true,
              avatar: true,
            }
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
            }
          }
        }
      }),
      this.prisma.like.count({ where })
    ]);

    const formattedLikes = likes.map(like => this.formatLikeResponse(like));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedLikes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async getUserLikes(userId: number, limit: number = 50): Promise<LikeResponseDto[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            uuid: true,
            name: true,
            surname: true,
            username: true,
            avatar: true,
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return likes.map(like => this.formatLikeResponse(like));
  }

  async getArticleLikeStats(articleId: number, userId?: number): Promise<ArticleLikeStatsDto> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    const likesCount = await this.prisma.like.count({
      where: { articleId }
    });

    let isLikedByUser = false;
    if (userId) {
      const userLike = await this.prisma.like.findUnique({
        where: {
          userId_articleId: {
            userId,
            articleId,
          }
        }
      });
      isLikedByUser = !!userLike;
    }

    return {
      articleId,
      likesCount,
      isLikedByUser,
    };
  }

  async removeLike(articleId: number, userId: number): Promise<{ message: string; likesCount: number }> {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        }
      }
    });

    if (!existingLike) {
      throw new NotFoundException('Beğeni bulunamadı');
    }

    await this.prisma.like.delete({
      where: { id: existingLike.id }
    });

    // Update article likes count
    await this.prisma.article.update({
      where: { id: articleId },
      data: { likes: { decrement: 1 } }
    });

    const likesCount = await this.prisma.like.count({
      where: { articleId }
    });

    return { 
      message: 'Beğeni başarıyla kaldırıldı',
      likesCount 
    };
  }

  async getTopLikedArticles(limit: number = 10): Promise<any[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        likes: true,
        _count: {
          select: {
            articleLikes: true
          }
        }
      },
      orderBy: [
        { likes: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    });

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image: article.image,
      likesCount: article._count.articleLikes,
    }));
  }

  private formatLikeResponse(like: any): LikeResponseDto {
    return {
      id: like.id,
      articleId: like.articleId,
      userId: like.userId,
      createdAt: like.createdAt,
      user: like.user,
      article: like.article,
    };
  }
}
