import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { UserRole } from '@prisma/client';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticlesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleActive: jest.fn(),
    getRelatedArticles: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'New Article',
      excerpt: 'This is a test article excerpt that meets minimum length requirements',
      content: 'This is the main content of the test article. It contains detailed information about the topic being discussed.',
      image: 'https://example.com/image.jpg',
      categoryId: 1,
      tagIds: [1, 2],
      isFeatured: false,
      isBreaking: false,
    };

    const mockArticleResponse = {
      id: 1,
      title: 'New Article',
      slug: 'new-article',
      excerpt: 'This is a test article excerpt that meets minimum length requirements',
      content: 'This is the main content of the test article. It contains detailed information about the topic being discussed.',
      image: 'https://example.com/image.jpg',
      isFeatured: false,
      isBreaking: false,
      isActive: true,
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
        { id: 1, name: 'JavaScript', slug: 'javascript' },
        { id: 2, name: 'React', slug: 'react' },
      ],
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
    };

    it('should create an article', async () => {
      mockArticlesService.create.mockResolvedValue(mockArticleResponse);

      const result = await controller.create(createArticleDto, mockUser);

      expect(result).toEqual(mockArticleResponse);
      expect(service.create).toHaveBeenCalledWith(createArticleDto, mockUser.id);
    });

    it('should handle creation conflicts', async () => {
      mockArticlesService.create.mockRejectedValue(
        new ConflictException('Bu başlıkta bir makale zaten mevcut'),
      );

      await expect(controller.create(createArticleDto, mockUser)).rejects.toThrow(ConflictException);
    });

    it('should handle not found errors for category/tags', async () => {
      mockArticlesService.create.mockRejectedValue(
        new NotFoundException('Kategori bulunamadı'),
      );

      await expect(controller.create(createArticleDto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const filterDto: ArticleFilterDto = { page: 1, limit: 10 };
    const mockPaginatedResponse = {
      data: [
        {
          id: 1,
          title: 'Article 1',
          slug: 'article-1',
          excerpt: 'Article 1 excerpt',
          content: 'Article 1 content',
          image: 'article1.jpg',
          isFeatured: true,
          isBreaking: false,
          isActive: true,
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
          tags: [],
          viewCount: 150,
          likeCount: 25,
          commentCount: 5,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

    it('should return paginated articles', async () => {
      mockArticlesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should handle search filters', async () => {
      const searchFilter = { ...filterDto, search: 'technology' };
      mockArticlesService.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(searchFilter);

      expect(service.findAll).toHaveBeenCalledWith(searchFilter);
    });

    it('should handle category filters', async () => {
      const categoryFilter = { ...filterDto, categoryId: 1 };
      mockArticlesService.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(categoryFilter);

      expect(service.findAll).toHaveBeenCalledWith(categoryFilter);
    });
  });

  describe('findFeatured', () => {
    const filterDto: ArticleFilterDto = { page: 1, limit: 10 };
    const mockFeaturedResponse = {
      data: [
        {
          id: 1,
          title: 'Featured Article',
          slug: 'featured-article',
          excerpt: 'Featured article excerpt',
          content: 'Featured article content',
          image: 'featured.jpg',
          isFeatured: true,
          isBreaking: false,
          isActive: true,
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
          tags: [],
          viewCount: 200,
          likeCount: 50,
          commentCount: 10,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

    it('should return featured articles', async () => {
      mockArticlesService.findAll.mockResolvedValue(mockFeaturedResponse);

      const result = await controller.findFeatured(filterDto);

      expect(result).toEqual(mockFeaturedResponse);
      expect(service.findAll).toHaveBeenCalledWith({ ...filterDto, isFeatured: true });
    });
  });

  describe('findBreaking', () => {
    const filterDto: ArticleFilterDto = { page: 1, limit: 10 };
    const mockBreakingResponse = {
      data: [
        {
          id: 1,
          title: 'Breaking News',
          slug: 'breaking-news',
          excerpt: 'Breaking news excerpt',
          content: 'Breaking news content',
          image: 'breaking.jpg',
          isFeatured: false,
          isBreaking: true,
          isActive: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: 1,
            name: 'News',
            slug: 'news',
            color: '#dc3545',
            icon: 'mdi-newspaper',
          },
          author: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
          tags: [],
          viewCount: 500,
          likeCount: 100,
          commentCount: 25,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

    it('should return breaking news articles', async () => {
      mockArticlesService.findAll.mockResolvedValue(mockBreakingResponse);

      const result = await controller.findBreaking(filterDto);

      expect(result).toEqual(mockBreakingResponse);
      expect(service.findAll).toHaveBeenCalledWith({ ...filterDto, isBreaking: true });
    });
  });

  describe('findOne', () => {
    const mockArticle = {
      id: 1,
      title: 'Single Article',
      slug: 'single-article',
      excerpt: 'Single article excerpt',
      content: 'Single article content',
      image: 'single.jpg',
      isFeatured: false,
      isBreaking: false,
      isActive: true,
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
      tags: [],
      viewCount: 75,
      likeCount: 15,
      commentCount: 3,
    };

    it('should return a single article by ID', async () => {
      mockArticlesService.findOne.mockResolvedValue(mockArticle);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockArticle);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle not found error', async () => {
      mockArticlesService.findOne.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    const mockArticle = {
      id: 1,
      title: 'Article by Slug',
      slug: 'article-by-slug',
      excerpt: 'Article by slug excerpt',
      content: 'Article by slug content',
      image: 'slug.jpg',
      isFeatured: false,
      isBreaking: false,
      isActive: true,
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
      tags: [],
      viewCount: 120,
      likeCount: 30,
      commentCount: 8,
    };

    it('should return article by slug', async () => {
      mockArticlesService.findBySlug.mockResolvedValue(mockArticle);

      const result = await controller.findBySlug('article-by-slug');

      expect(result).toEqual(mockArticle);
      expect(service.findBySlug).toHaveBeenCalledWith('article-by-slug');
    });

    it('should handle not found error for slug', async () => {
      mockArticlesService.findBySlug.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRelatedArticles', () => {
    const mockRelatedArticles = [
      {
        id: 2,
        title: 'Related Article 1',
        slug: 'related-1',
        excerpt: 'Related article 1 excerpt',
        content: 'Related article 1 content',
        image: 'related1.jpg',
        isFeatured: false,
        isBreaking: false,
        isActive: true,
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
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        tags: [],
        viewCount: 85,
        likeCount: 20,
        commentCount: 5,
      },
    ];

    it('should return related articles', async () => {
      mockArticlesService.getRelatedArticles.mockResolvedValue(mockRelatedArticles);

      const result = await controller.getRelatedArticles(1, '5');

      expect(result).toEqual(mockRelatedArticles);
      expect(service.getRelatedArticles).toHaveBeenCalledWith(1, 5);
    });

    it('should use default limit when not provided', async () => {
      mockArticlesService.getRelatedArticles.mockResolvedValue(mockRelatedArticles);

      await controller.getRelatedArticles(1);

      expect(service.getRelatedArticles).toHaveBeenCalledWith(1, 5);
    });

    it('should handle not found error', async () => {
      mockArticlesService.getRelatedArticles.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.getRelatedArticles(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Article',
      excerpt: 'Updated article excerpt that meets minimum requirements',
      content: 'Updated article content with detailed information about the updated topic.',
    };

    const mockUpdatedArticle = {
      id: 1,
      title: 'Updated Article',
      slug: 'updated-article',
      excerpt: 'Updated article excerpt that meets minimum requirements',
      content: 'Updated article content with detailed information about the updated topic.',
      image: null,
      isFeatured: false,
      isBreaking: false,
      isActive: true,
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
      tags: [],
      viewCount: 100,
      likeCount: 25,
      commentCount: 5,
    };

    it('should update an article', async () => {
      mockArticlesService.update.mockResolvedValue(mockUpdatedArticle);

      const result = await controller.update(1, updateArticleDto, mockUser);

      expect(result).toEqual(mockUpdatedArticle);
      expect(service.update).toHaveBeenCalledWith(1, updateArticleDto, mockUser.id, mockUser.role);
    });

    it('should handle not found error', async () => {
      mockArticlesService.update.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.update(999, updateArticleDto, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should handle forbidden error', async () => {
      mockArticlesService.update.mockRejectedValue(
        new ForbiddenException('Bu makaleyi düzenleme yetkiniz yok'),
      );

      await expect(controller.update(1, updateArticleDto, mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should handle update conflicts', async () => {
      mockArticlesService.update.mockRejectedValue(
        new ConflictException('Bu başlıkta bir makale zaten mevcut'),
      );

      await expect(controller.update(1, updateArticleDto, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete an article', async () => {
      mockArticlesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, mockUser);

      expect(result).toEqual({ message: 'Makale başarıyla silindi' });
      expect(service.remove).toHaveBeenCalledWith(1, mockUser.id, mockUser.role);
    });

    it('should handle not found error', async () => {
      mockArticlesService.remove.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.remove(999, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should handle forbidden error', async () => {
      mockArticlesService.remove.mockRejectedValue(
        new ForbiddenException('Bu makaleyi silme yetkiniz yok'),
      );

      await expect(controller.remove(1, mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should handle conflict when article has dependencies', async () => {
      mockArticlesService.remove.mockRejectedValue(
        new ConflictException('Bu makaleye ait beğeniler, yorumlar veya yer imleri olduğu için silinemez'),
      );

      await expect(controller.remove(1, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('toggleActive', () => {
    const mockToggledArticle = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'Test article excerpt',
      content: 'Test article content',
      image: 'test.jpg',
      isFeatured: false,
      isBreaking: false,
      isActive: false, // Toggled to inactive
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
      tags: [],
      viewCount: 50,
      likeCount: 10,
      commentCount: 2,
    };

    it('should toggle article active status', async () => {
      mockArticlesService.toggleActive.mockResolvedValue(mockToggledArticle);

      const result = await controller.toggleActive(1);

      expect(result).toEqual(mockToggledArticle);
      expect(service.toggleActive).toHaveBeenCalledWith(1);
    });

    it('should handle not found error', async () => {
      mockArticlesService.toggleActive.mockRejectedValue(
        new NotFoundException('Makale bulunamadı'),
      );

      await expect(controller.toggleActive(999)).rejects.toThrow(NotFoundException);
    });
  });
});