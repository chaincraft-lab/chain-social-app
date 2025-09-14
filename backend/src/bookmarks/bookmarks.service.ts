import { 
  Injectable, 
  NotFoundException, 
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { BookmarkFilterDto } from './dto/bookmark-filter.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleBookmark(createBookmarkDto: CreateBookmarkDto, userId: number): Promise<{ 
    action: 'bookmarked' | 'unbookmarked'; 
    bookmark?: BookmarkResponseDto;
  }> {
    const { articleId } = createBookmarkDto;

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

    // Check if user already bookmarked this article
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        }
      }
    });

    if (existingBookmark) {
      // Unbookmark - remove the bookmark
      await this.prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });

      return { action: 'unbookmarked' };
    } else {
      // Bookmark - create new bookmark
      const bookmark = await this.prisma.bookmark.create({
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
              excerpt: true,
              image: true,
              publishedAt: true,
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
      });

      return { 
        action: 'bookmarked',
        bookmark: this.formatBookmarkResponse(bookmark)
      };
    }
  }

  async findAll(filterDto: BookmarkFilterDto): Promise<PaginatedResponse<BookmarkResponseDto>> {
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

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
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
              excerpt: true,
              image: true,
              publishedAt: true,
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
      }),
      this.prisma.bookmark.count({ where })
    ]);

    const formattedBookmarks = bookmarks.map(bookmark => this.formatBookmarkResponse(bookmark));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedBookmarks,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async getUserBookmarks(userId: number, limit: number = 50): Promise<BookmarkResponseDto[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
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
            excerpt: true,
            image: true,
            publishedAt: true,
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return bookmarks.map(bookmark => this.formatBookmarkResponse(bookmark));
  }

  async getUserBookmarksPaginated(userId: number, filterDto: BookmarkFilterDto): Promise<PaginatedResponse<BookmarkResponseDto>> {
    const { 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filterDto;

    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
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
              excerpt: true,
              image: true,
              publishedAt: true,
              views: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                }
              },
              author: {
                select: {
                  name: true,
                  surname: true,
                }
              },
              _count: {
                select: {
                  articleLikes: true,
                  comments: true,
                }
              }
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.bookmark.count({ where: { userId } })
    ]);

    const formattedBookmarks = bookmarks.map(bookmark => this.formatBookmarkResponse(bookmark));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedBookmarks,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async removeBookmark(articleId: number, userId: number): Promise<{ message: string }> {
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        }
      }
    });

    if (!existingBookmark) {
      throw new NotFoundException('Bookmark bulunamadı');
    }

    await this.prisma.bookmark.delete({
      where: { id: existingBookmark.id }
    });

    return { message: 'Bookmark başarıyla kaldırıldı' };
  }

  async isBookmarked(articleId: number, userId: number): Promise<{ isBookmarked: boolean }> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        }
      }
    });

    return { isBookmarked: !!bookmark };
  }

  async getMostBookmarkedArticles(limit: number = 10): Promise<any[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        publishedAt: true,
        _count: {
          select: {
            bookmarks: true
          }
        },
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
      },
      orderBy: [
        { bookmarks: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: limit,
    });

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      image: article.image,
      publishedAt: article.publishedAt,
      bookmarksCount: article._count.bookmarks,
      categoryName: article.category.name,
      authorName: `${article.author.name} ${article.author.surname}`,
    }));
  }

  async getBookmarkStats(): Promise<{
    totalBookmarks: number;
    totalBookmarkedArticles: number;
    topBookmarkedArticle: any;
  }> {
    const [totalBookmarks, totalBookmarkedArticles, topBookmarkedArticle] = await Promise.all([
      this.prisma.bookmark.count(),
      this.prisma.bookmark.groupBy({
        by: ['articleId'],
        _count: true,
      }).then(result => result.length),
      this.prisma.article.findFirst({
        where: {
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          _count: {
            select: {
              bookmarks: true
            }
          }
        },
        orderBy: {
          bookmarks: { _count: 'desc' }
        }
      })
    ]);

    return {
      totalBookmarks,
      totalBookmarkedArticles,
      topBookmarkedArticle: topBookmarkedArticle ? {
        id: topBookmarkedArticle.id,
        title: topBookmarkedArticle.title,
        slug: topBookmarkedArticle.slug,
        bookmarksCount: topBookmarkedArticle._count.bookmarks,
      } : null,
    };
  }

  private formatBookmarkResponse(bookmark: any): BookmarkResponseDto {
    return {
      id: bookmark.id,
      articleId: bookmark.articleId,
      userId: bookmark.userId,
      createdAt: bookmark.createdAt,
      user: bookmark.user,
      article: bookmark.article ? {
        id: bookmark.article.id,
        title: bookmark.article.title,
        slug: bookmark.article.slug,
        excerpt: bookmark.article.excerpt,
        image: bookmark.article.image,
        publishedAt: bookmark.article.publishedAt,
        categoryName: bookmark.article.category?.name || '',
        authorName: `${bookmark.article.author?.name || ''} ${bookmark.article.author?.surname || ''}`.trim(),
      } : undefined,
    };
  }
}
