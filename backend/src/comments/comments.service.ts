import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentFilterDto } from './dto/comment-filter.dto';
import { ModerateCommentDto } from './dto/moderate-comment.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { CommentStatus, UserRole } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<CommentResponseDto> {
    const { content, articleId, parentId } = createCommentDto;

    // Verify article exists and is published
    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        status: 'PUBLISHED',
      }
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı veya yorum kabul etmiyor');
    }

    // If parentId provided, verify parent comment exists
    if (parentId) {
      const parentComment = await this.prisma.comment.findFirst({
        where: {
          id: parentId,
          articleId,
          status: CommentStatus.APPROVED,
        }
      });

      if (!parentComment) {
        throw new NotFoundException('Cevaplamaya çalıştığınız yorum bulunamadı');
      }
    }

    // Create comment
    const comment = await this.prisma.comment.create({
      data: {
        content,
        articleId,
        userId,
        parentId,
        status: CommentStatus.PENDING, // Default to pending for moderation
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
        replies: {
          where: {
            status: CommentStatus.APPROVED,
          },
          select: { id: true }
        }
      }
    });

    return this.formatCommentResponse(comment);
  }

  async findAll(filterDto: CommentFilterDto): Promise<PaginatedResponse<CommentResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      articleId, 
      userId, 
      status, 
      parentId,
      onlyParents = false
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (articleId) {
      where.articleId = articleId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    } else {
      // Default to approved comments for public view
      where.status = CommentStatus.APPROVED;
    }

    if (onlyParents) {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
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
          replies: {
            where: {
              status: CommentStatus.APPROVED,
            },
            select: { id: true }
          }
        }
      }),
      this.prisma.comment.count({ where })
    ]);

    const formattedComments = comments.map(comment => this.formatCommentResponse(comment));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: formattedComments,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async findOne(id: number): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
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
        replies: {
          where: {
            status: CommentStatus.APPROVED,
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
            replies: {
              select: { id: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!comment) {
      throw new NotFoundException('Yorum bulunamadı');
    }

    return this.formatCommentResponse(comment);
  }

  async update(
    id: number, 
    updateCommentDto: UpdateCommentDto, 
    userId: number, 
    userRole: UserRole
  ): Promise<CommentResponseDto> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      throw new NotFoundException('Yorum bulunamadı');
    }

    // Check permissions - users can only edit their own comments
    if (userRole === UserRole.USER && existingComment.userId !== userId) {
      throw new ForbiddenException('Bu yorumu düzenleme yetkiniz yok');
    }

    // Users can only edit within 15 minutes and if comment is not approved yet
    if (userRole === UserRole.USER) {
      const commentAge = Date.now() - existingComment.createdAt.getTime();
      const fifteenMinutes = 15 * 60 * 1000;
      
      if (commentAge > fifteenMinutes || existingComment.status === CommentStatus.APPROVED) {
        throw new ForbiddenException('Yorum düzenleme süresi dolmuş veya yorum zaten onaylanmış');
      }
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: {
        ...updateCommentDto,
        // Reset status to pending if content changed
        status: userRole === UserRole.USER ? CommentStatus.PENDING : existingComment.status,
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
        replies: {
          where: {
            status: CommentStatus.APPROVED,
          },
          select: { id: true }
        }
      }
    });

    return this.formatCommentResponse(updatedComment);
  }

  async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        replies: { select: { id: true } }
      }
    });

    if (!comment) {
      throw new NotFoundException('Yorum bulunamadı');
    }

    // Check permissions
    if (userRole === UserRole.USER && comment.userId !== userId) {
      throw new ForbiddenException('Bu yorumu silme yetkiniz yok');
    }

    // If comment has replies, don't allow deletion by regular users
    if (comment.replies.length > 0 && userRole === UserRole.USER) {
      throw new BadRequestException('Cevapları olan yorumlar silinemez');
    }

    // Delete comment and its replies (cascade)
    await this.prisma.comment.delete({
      where: { id }
    });
  }

  async moderate(id: number, moderateCommentDto: ModerateCommentDto): Promise<CommentResponseDto> {
    const { status } = moderateCommentDto;

    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('Yorum bulunamadı');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { status },
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
        replies: {
          where: {
            status: CommentStatus.APPROVED,
          },
          select: { id: true }
        }
      }
    });

    return this.formatCommentResponse(updatedComment);
  }

  async getCommentsByArticle(articleId: number, limit: number = 50): Promise<CommentResponseDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        articleId,
        status: CommentStatus.APPROVED,
        parentId: null, // Only parent comments
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
        replies: {
          where: {
            status: CommentStatus.APPROVED,
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
            replies: {
              select: { id: true }
            }
          },
          orderBy: { createdAt: 'asc' },
          take: 5 // Limit replies per comment
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return comments.map(comment => this.formatCommentResponse(comment));
  }

  private formatCommentResponse(comment: any): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      status: comment.status,
      articleId: comment.articleId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user,
      replies: comment.replies?.map((reply: any) => this.formatCommentResponse(reply)) || [],
      repliesCount: comment.replies?.length || 0,
    };
  }
}
