import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto, ArticleSortBy, SortOrder } from './dto/article-filter.dto';
import { UserRole, ArticleStatus, CommentStatus } from '@prisma/client';

const mockPrismaService = {
  category: {
    findFirst: jest.fn(),
  },
  tag: {
    findMany: jest.fn(),
  },
  article: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  articleTag: {
    deleteMany: jest.fn(),
  },
  like: {
    count: jest.fn(),
  },
  comment: {
    count: jest.fn(),
  },
  bookmark: {
    count: jest.fn(),
  },
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'Test Article',
      excerpt: 'This is a test article excerpt for testing purposes',
      content: 'This is the main content of the test article. It contains detailed information about the topic.',
      image: 'https://example.com/image.jpg',
      categoryId: 1,
      tagIds: [1, 2],
      isFeatured: false,
      isBreaking: false,
    };

    const mockCategory = {
      id: 1,
      name: 'Technology',
      slug: 'technology',
      isActive: true,
    };

    const mockTags = [
      { id: 1, name: 'JavaScript', slug: 'javascript' },
      { id: 2, name: 'React', slug: 'react' },
    ];

    const mockCreatedArticle = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'This is a test article excerpt for testing purposes',
      content: 'This is the main content of the test article. It contains detailed information about the topic.',
      image: 'https://example.com/image.jpg',
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      isBreaking: false,
      views: 0,
      likes: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 1,
        name: 'Technology',
        slug: 'technology',
        color: '#007bff',
        icon: 'mdi-laptop',
      },
      author: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
      tags: [
        {
          tag: {
            id: 1,
            name: 'JavaScript',
            slug: 'javascript',
          }
        },
        {
          tag: {
            id: 2,
            name: 'React',
            slug: 'react',
          }
        }
      ],
      _count: {
        articleLikes: 0,
        comments: 0,
      }
    };

    it('should create an article successfully', async () => {
      // Mock category exists
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      
      // Mock tags exist
      mockPrismaService.tag.findMany.mockResolvedValue(mockTags);
      
      // Mock no existing slugs
      mockPrismaService.article.findMany.mockResolvedValue([]);
      
      // Mock article creation
      mockPrismaService.article.create.mockResolvedValue(mockCreatedArticle);

      const result = await service.create(createArticleDto, 1);

      expect(result).toBeDefined();
      expect(result.title).toBe(createArticleDto.title);
      expect(result.slug).toBe('test-article');
      expect(result.isActive).toBe(true);
      expect(result.category).toEqual(mockCreatedArticle.category);
      expect(result.tags).toHaveLength(2);
      expect(mockPrismaService.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: createArticleDto.title,
            slug: 'test-article',
            status: ArticleStatus.PUBLISHED,
            categoryId: createArticleDto.categoryId,
            authorId: 1,
          })
        })
      );
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.create(createArticleDto, 1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: createArticleDto.categoryId,
          isActive: true,
        }
      });
    });

    it('should throw NotFoundException when tags do not exist', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.tag.findMany.mockResolvedValue([mockTags[0]]); // Only one tag found

      await expect(service.create(createArticleDto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should generate unique slug when duplicate exists', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.tag.findMany.mockResolvedValue(mockTags);
      
      // Mock existing slug
      mockPrismaService.article.findMany.mockResolvedValue([
        { slug: 'test-article' },
        { slug: 'test-article-1' }
      ]);
      
      const expectedArticle = {
        ...mockCreatedArticle,
        slug: 'test-article-2'
      };
      
      mockPrismaService.article.create.mockResolvedValue(expectedArticle);

      const result = await service.create(createArticleDto, 1);

      expect(result.slug).toBe('test-article-2');
    });

    it('should create article without tags', async () => {
      const dtoWithoutTags = { ...createArticleDto, tagIds: [] };
      
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.article.findMany.mockResolvedValue([]);
      
      const expectedArticle = {
        ...mockCreatedArticle,
        tags: []
      };
      
      mockPrismaService.article.create.mockResolvedValue(expectedArticle);

      const result = await service.create(dtoWithoutTags, 1);

      expect(result.tags).toHaveLength(0);
      expect(mockPrismaService.tag.findMany).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Article 1',
        slug: 'article-1',
        excerpt: 'Excerpt 1',
        content: 'Content 1',
        image: 'image1.jpg',
        status: ArticleStatus.PUBLISHED,
        isFeatured: true,
        isBreaking: false,
        views: 100,
        likes: 5,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
        author: { id: 1, name: 'John', email: 'john@test.com' },
        tags: [{ tag: { id: 1, name: 'JS', slug: 'js' } }],
        _count: { articleLikes: 5, comments: 3 }
      }
    ];

    it('should return paginated articles', async () => {
      const filterDto: ArticleFilterDto = { page: 1, limit: 10 };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      const result = await service.findAll(filterDto);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
    });

    it('should filter by category ID', async () => {
      const filterDto: ArticleFilterDto = { categoryId: 1 };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 1
          })
        })
      );
    });

    it('should filter by category slug', async () => {
      const filterDto: ArticleFilterDto = { categorySlug: 'technology' };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: {
              slug: 'technology',
              isActive: true
            }
          })
        })
      );
    });

    it('should filter by search term', async () => {
      const filterDto: ArticleFilterDto = { search: 'test' };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { excerpt: { contains: 'test', mode: 'insensitive' } },
              { content: { contains: 'test', mode: 'insensitive' } },
            ]
          })
        })
      );
    });

    it('should filter by featured articles', async () => {
      const filterDto: ArticleFilterDto = { isFeatured: true };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isFeatured: true
          })
        })
      );
    });

    it('should sort by different fields', async () => {
      const filterDto: ArticleFilterDto = { sortBy: ArticleSortBy.VIEW_COUNT, sortOrder: SortOrder.DESC };
      
      mockPrismaService.article.findMany.mockResolvedValue(mockArticles);
      mockPrismaService.article.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { views: 'desc' }
        })
      );
    });
  });

  describe('findOne', () => {
    const mockArticle = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'Test excerpt',
      content: 'Test content',
      image: 'test.jpg',
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      isBreaking: false,
      views: 10,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
      author: { id: 1, name: 'John', email: 'john@test.com' },
      tags: [],
      _count: { articleLikes: 0, comments: 0 }
    };

    it('should return article by ID and increment view count', async () => {
      mockPrismaService.article.findFirst.mockResolvedValue(mockArticle);
      mockPrismaService.article.update.mockResolvedValue(mockArticle);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Article');
      expect(mockPrismaService.article.findFirst).toHaveBeenCalledWith({
        where: { id: 1, status: ArticleStatus.PUBLISHED },
        include: expect.any(Object)
      });
      expect(mockPrismaService.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { views: { increment: 1 } }
      });
    });

    it('should throw NotFoundException when article not found', async () => {
      mockPrismaService.article.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    const mockArticle = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'Test excerpt',
      content: 'Test content',
      image: 'test.jpg',
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      isBreaking: false,
      views: 10,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
      author: { id: 1, name: 'John', email: 'john@test.com' },
      tags: [],
      _count: { articleLikes: 0, comments: 0 }
    };

    it('should return article by slug and increment view count', async () => {
      mockPrismaService.article.findFirst.mockResolvedValue(mockArticle);
      mockPrismaService.article.update.mockResolvedValue(mockArticle);

      const result = await service.findBySlug('test-article');

      expect(result).toBeDefined();
      expect(result.slug).toBe('test-article');
      expect(mockPrismaService.article.findFirst).toHaveBeenCalledWith({
        where: { slug: 'test-article', status: ArticleStatus.PUBLISHED },
        include: expect.any(Object)
      });
    });

    it('should throw NotFoundException when article not found by slug', async () => {
      mockPrismaService.article.findFirst.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Article',
      excerpt: 'Updated excerpt',
      content: 'Updated content',
    };

    const existingArticle = {
      id: 1,
      title: 'Original Article',
      slug: 'original-article',
      authorId: 1,
      categoryId: 1,
    };

    const mockCategory = {
      id: 1,
      name: 'Technology',
      slug: 'technology',
      isActive: true,
    };

    const mockUpdatedArticle = {
      id: 1,
      title: 'Updated Article',
      slug: 'updated-article',
      excerpt: 'Updated excerpt',
      content: 'Updated content',
      image: null,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      isBreaking: false,
      views: 10,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
      author: { id: 1, name: 'John', email: 'john@test.com' },
      tags: [],
      _count: { articleLikes: 0, comments: 0 }
    };

    it('should update article successfully', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(existingArticle);
      mockPrismaService.article.findMany.mockResolvedValue([]);
      mockPrismaService.article.update.mockResolvedValue(mockUpdatedArticle);

      const result = await service.update(1, updateArticleDto, 1, UserRole.ADMIN);

      expect(result.title).toBe('Updated Article');
      expect(result.slug).toBe('updated-article');
      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({
            title: 'Updated Article',
            slug: 'updated-article',
            excerpt: 'Updated excerpt',
            content: 'Updated content',
          })
        })
      );
    });

    it('should throw NotFoundException when article not found', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, updateArticleDto, 1, UserRole.ADMIN)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user tries to update others article', async () => {
      const articleByAnotherUser = { ...existingArticle, authorId: 2 };
      mockPrismaService.article.findUnique.mockResolvedValue(articleByAnotherUser);

      await expect(
        service.update(1, updateArticleDto, 1, UserRole.USER)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow author to update their own article', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(existingArticle);
      mockPrismaService.article.findMany.mockResolvedValue([]);
      mockPrismaService.article.update.mockResolvedValue(mockUpdatedArticle);

      const result = await service.update(1, updateArticleDto, 1, UserRole.USER);

      expect(result).toBeDefined();
      expect(result.title).toBe('Updated Article');
    });

    it('should update tags when tagIds provided', async () => {
      const dtoWithTags = { ...updateArticleDto, tagIds: [1, 2] };
      
      mockPrismaService.article.findUnique.mockResolvedValue(existingArticle);
      mockPrismaService.article.findMany.mockResolvedValue([]);
      mockPrismaService.tag.findMany.mockResolvedValue([
        { id: 1, name: 'Tag1', slug: 'tag1' },
        { id: 2, name: 'Tag2', slug: 'tag2' },
      ]);
      mockPrismaService.articleTag.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.article.update.mockResolvedValue(mockUpdatedArticle);

      await service.update(1, dtoWithTags, 1, UserRole.ADMIN);

      expect(mockPrismaService.articleTag.deleteMany).toHaveBeenCalledWith({
        where: { articleId: 1 }
      });
      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tags: {
              create: [{ tagId: 1 }, { tagId: 2 }]
            }
          })
        })
      );
    });
  });

  describe('remove', () => {
    const mockArticle = {
      id: 1,
      title: 'Test Article',
      authorId: 1,
    };

    it('should delete article successfully', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(mockArticle);
      mockPrismaService.like.count.mockResolvedValue(0);
      mockPrismaService.comment.count.mockResolvedValue(0);
      mockPrismaService.bookmark.count.mockResolvedValue(0);
      mockPrismaService.article.delete.mockResolvedValue(mockArticle);

      await service.remove(1, 1, UserRole.ADMIN);

      expect(mockPrismaService.article.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should throw NotFoundException when article not found', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(service.remove(999, 1, UserRole.ADMIN)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user tries to delete others article', async () => {
      const articleByAnotherUser = { ...mockArticle, authorId: 2 };
      mockPrismaService.article.findUnique.mockResolvedValue(articleByAnotherUser);

      await expect(service.remove(1, 1, UserRole.USER)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException when article has dependencies', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(mockArticle);
      mockPrismaService.like.count.mockResolvedValue(5); // Has likes
      mockPrismaService.comment.count.mockResolvedValue(3);
      mockPrismaService.bookmark.count.mockResolvedValue(2);

      await expect(service.remove(1, 1, UserRole.ADMIN)).rejects.toThrow(ConflictException);
    });
  });

  describe('toggleActive', () => {
    it('should toggle article from PUBLISHED to DRAFT', async () => {
      const publishedArticle = {
        id: 1,
        status: ArticleStatus.PUBLISHED,
      };

      const draftArticle = {
        ...publishedArticle,
        status: ArticleStatus.DRAFT,
        category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
        author: { id: 1, name: 'John', email: 'john@test.com' },
        tags: [],
        _count: { articleLikes: 0, comments: 0 },
        title: 'Test',
        slug: 'test',
        excerpt: 'Test',
        content: 'Test',
        image: null,
        isFeatured: false,
        isBreaking: false,
        views: 0,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.article.findUnique.mockResolvedValue(publishedArticle);
      mockPrismaService.article.update.mockResolvedValue(draftArticle);

      const result = await service.toggleActive(1);

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: ArticleStatus.DRAFT },
        include: expect.any(Object)
      });
    });

    it('should toggle article from DRAFT to PUBLISHED', async () => {
      const draftArticle = {
        id: 1,
        status: ArticleStatus.DRAFT,
      };

      const publishedArticle = {
        ...draftArticle,
        status: ArticleStatus.PUBLISHED,
        category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
        author: { id: 1, name: 'John', email: 'john@test.com' },
        tags: [],
        _count: { articleLikes: 0, comments: 0 },
        title: 'Test',
        slug: 'test',
        excerpt: 'Test',
        content: 'Test',
        image: null,
        isFeatured: false,
        isBreaking: false,
        views: 0,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.article.findUnique.mockResolvedValue(draftArticle);
      mockPrismaService.article.update.mockResolvedValue(publishedArticle);

      const result = await service.toggleActive(1);

      expect(result.isActive).toBe(true);
      expect(mockPrismaService.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: ArticleStatus.PUBLISHED },
        include: expect.any(Object)
      });
    });
  });

  describe('getRelatedArticles', () => {
    const mockArticle = {
      categoryId: 1,
    };

    const mockRelatedArticles = [
      {
        id: 2,
        title: 'Related Article 1',
        slug: 'related-1',
        excerpt: 'Related excerpt',
        content: 'Related content',
        image: 'related.jpg',
        status: ArticleStatus.PUBLISHED,
        isFeatured: false,
        isBreaking: false,
        views: 50,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 1, name: 'Tech', slug: 'tech', color: '#007bff', icon: 'mdi-laptop' },
        author: { id: 2, name: 'Jane', email: 'jane@test.com' },
        tags: [],
        _count: { articleLikes: 2, comments: 1 }
      }
    ];

    it('should return related articles from same category', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(mockArticle);
      mockPrismaService.article.findMany.mockResolvedValue(mockRelatedArticles);

      const result = await service.getRelatedArticles(1, 5);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Related Article 1');
      expect(mockPrismaService.article.findMany).toHaveBeenCalledWith({
        where: {
          categoryId: 1,
          id: { not: 1 },
          status: ArticleStatus.PUBLISHED,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object)
      });
    });

    it('should throw NotFoundException when article not found', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(service.getRelatedArticles(999)).rejects.toThrow(NotFoundException);
    });
  });
});