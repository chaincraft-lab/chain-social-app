import { Injectable } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { ArticleStatus, CommentStatus } from '@prisma/client';

interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalUsers: number;
  pendingComments: number;
  recentArticles: Array<{
    id: number;
    title: string;
    createdAt: Date;
  }>;
  todayStats: {
    articlesCreated: number;
    commentsReceived: number;
    newUsers: number;
  };
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const [
      totalArticles,
      totalCategories,
      totalUsers,
      pendingComments,
      recentArticles,
      todayArticles,
      todayComments,
      todayUsers
    ] = await Promise.all([
      this.prisma.article.count({
        where: { status: ArticleStatus.PUBLISHED }
      }),
      this.prisma.category.count(),
      this.prisma.user.count(),
      this.prisma.comment.count({
        where: { status: CommentStatus.PENDING }
      }),
      this.prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        select: {
          id: true,
          title: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      this.prisma.article.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      this.prisma.comment.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
    ]);

    return {
      totalArticles,
      totalCategories,
      totalUsers,
      pendingComments,
      recentArticles,
      todayStats: {
        articlesCreated: todayArticles,
        commentsReceived: todayComments,
        newUsers: todayUsers
      }
    };
  }
}
