import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UserRole, ArticleStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('Articles (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // Test user tokens
  let adminToken: string;
  let authorToken: string;
  let userToken: string;

  // Test user IDs
  let adminUserId: number;
  let authorUserId: number;
  let regularUserId: number;

  // Test data IDs
  let testCategoryId: number;
  let testTagIds: number[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    await app.init();

    // Clean database and seed test data
    await cleanDatabase();
    await seedTestData();
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  beforeEach(async () => {
    // Clean articles before each test
    await prisma.article.deleteMany();
  });

  async function cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('E2E tests should only run in test environment');
    }

    // Delete in correct order due to foreign key constraints
    await prisma.articleTag.deleteMany();
    await prisma.article.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }

  async function seedTestData() {
    // Create test users
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'hashedpassword',
        role: UserRole.ADMIN,
      },
    });

    const authorUser = await prisma.user.create({
      data: {
        name: 'Author User',
        email: 'author@test.com',
        password: 'hashedpassword',
        role: UserRole.AUTHOR,
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@test.com',
        password: 'hashedpassword',
        role: UserRole.USER,
      },
    });

    // Create test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test category for articles',
        color: '#007bff',
        icon: 'mdi-test',
        isActive: true,
      },
    });
    testCategoryId = category.id;

    // Create test tags
    const tag1 = await prisma.tag.create({
      data: {
        name: 'JavaScript',
        slug: 'javascript',
      },
    });

    const tag2 = await prisma.tag.create({
      data: {
        name: 'TypeScript',
        slug: 'typescript',
      },
    });

    testTagIds = [tag1.id, tag2.id];

    // Store user IDs
    adminUserId = adminUser.id;
    authorUserId = authorUser.id;
    regularUserId = regularUser.id;

    // Generate JWT tokens
    adminToken = jwtService.sign({ 
      sub: adminUser.id, 
      email: adminUser.email, 
      role: adminUser.role 
    });
    
    authorToken = jwtService.sign({ 
      sub: authorUser.id, 
      email: authorUser.email, 
      role: authorUser.role 
    });
    
    userToken = jwtService.sign({ 
      sub: regularUser.id, 
      email: regularUser.email, 
      role: regularUser.role 
    });
  }

  describe('GET /articles', () => {
    it('should return empty array when no articles', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/articles')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });

    it('should return paginated articles', async () => {
      // Create test articles
      await prisma.article.createMany({
        data: [
          {
            title: 'Article 1',
            slug: 'article-1',
            excerpt: 'This is the first test article excerpt with enough content',
            content: 'This is the detailed content of the first test article with comprehensive information.',
            status: ArticleStatus.PUBLISHED,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
          {
            title: 'Article 2',
            slug: 'article-2',
            excerpt: 'This is the second test article excerpt with enough content',
            content: 'This is the detailed content of the second test article with comprehensive information.',
            status: ArticleStatus.PUBLISHED,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/articles?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.totalPages).toBe(1);
      expect(response.body.data.hasNext).toBe(false);
    });

    it('should filter articles by category', async () => {
      await prisma.article.create({
        data: {
          title: 'Filtered Article',
          slug: 'filtered-article',
          excerpt: 'This is a filtered test article excerpt with enough content',
          content: 'This is the detailed content of the filtered test article.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/articles?categoryId=${testCategoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].category.id).toBe(testCategoryId);
    });

    it('should filter articles by search term', async () => {
      await prisma.article.create({
        data: {
          title: 'JavaScript Tutorial',
          slug: 'javascript-tutorial',
          excerpt: 'Learn JavaScript programming with this comprehensive tutorial',
          content: 'This tutorial covers JavaScript fundamentals and advanced topics.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/articles?search=JavaScript')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].title).toContain('JavaScript');
    });
  });

  describe('GET /articles/featured', () => {
    it('should return only featured articles', async () => {
      await prisma.article.createMany({
        data: [
          {
            title: 'Featured Article',
            slug: 'featured-article',
            excerpt: 'This is a featured article excerpt with sufficient content',
            content: 'This is the content of a featured article with detailed information.',
            status: ArticleStatus.PUBLISHED,
            isFeatured: true,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
          {
            title: 'Regular Article',
            slug: 'regular-article',
            excerpt: 'This is a regular article excerpt with sufficient content',
            content: 'This is the content of a regular article.',
            status: ArticleStatus.PUBLISHED,
            isFeatured: false,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/articles/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].isFeatured).toBe(true);
      expect(response.body.data.data[0].title).toBe('Featured Article');
    });
  });

  describe('GET /articles/breaking', () => {
    it('should return only breaking news articles', async () => {
      await prisma.article.createMany({
        data: [
          {
            title: 'Breaking News',
            slug: 'breaking-news',
            excerpt: 'This is breaking news article excerpt with sufficient content',
            content: 'This is breaking news content with important information.',
            status: ArticleStatus.PUBLISHED,
            isBreaking: true,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
          {
            title: 'Regular News',
            slug: 'regular-news',
            excerpt: 'This is regular news article excerpt with sufficient content',
            content: 'This is regular news content.',
            status: ArticleStatus.PUBLISHED,
            isBreaking: false,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/articles/breaking')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].isBreaking).toBe(true);
      expect(response.body.data.data[0].title).toBe('Breaking News');
    });
  });

  describe('GET /articles/:id', () => {
    it('should return article by ID and increment view count', async () => {
      const article = await prisma.article.create({
        data: {
          title: 'Single Article',
          slug: 'single-article',
          excerpt: 'This is a single article excerpt with enough content for testing',
          content: 'This is the detailed content of a single article for viewing.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
          views: 0,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/articles/${article.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(article.id);
      expect(response.body.data.title).toBe('Single Article');

      // Check if view count was incremented
      const updatedArticle = await prisma.article.findUnique({
        where: { id: article.id },
      });
      expect(updatedArticle.views).toBe(1);
    });

    it('should return 404 for non-existent article', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/articles/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Makale bulunamadı');
    });

    it('should return 404 for draft article', async () => {
      const draftArticle = await prisma.article.create({
        data: {
          title: 'Draft Article',
          slug: 'draft-article',
          excerpt: 'This is a draft article excerpt for testing purposes',
          content: 'This is the content of a draft article.',
          status: ArticleStatus.DRAFT,
          categoryId: testCategoryId,
          authorId: adminUserId,
        },
      });

      await request(app.getHttpServer())
        .get(`/api/v1/articles/${draftArticle.id}`)
        .expect(404);
    });
  });

  describe('GET /articles/slug/:slug', () => {
    it('should return article by slug', async () => {
      await prisma.article.create({
        data: {
          title: 'Slug Article',
          slug: 'slug-article',
          excerpt: 'This is an article accessible by slug with enough content',
          content: 'This is the content of an article accessed via slug.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/articles/slug/slug-article')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('slug-article');
      expect(response.body.data.title).toBe('Slug Article');
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/articles/slug/nonexistent')
        .expect(404);
    });
  });

  describe('GET /articles/:id/related', () => {
    it('should return related articles from same category', async () => {
      const mainArticle = await prisma.article.create({
        data: {
          title: 'Main Article',
          slug: 'main-article',
          excerpt: 'This is the main article excerpt for related article testing',
          content: 'This is the main article content.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });

      // Create related articles in same category
      await prisma.article.createMany({
        data: [
          {
            title: 'Related Article 1',
            slug: 'related-1',
            excerpt: 'This is the first related article excerpt with enough content',
            content: 'This is the first related article content.',
            status: ArticleStatus.PUBLISHED,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
          {
            title: 'Related Article 2',
            slug: 'related-2',
            excerpt: 'This is the second related article excerpt with enough content',
            content: 'This is the second related article content.',
            status: ArticleStatus.PUBLISHED,
            categoryId: testCategoryId,
            authorId: adminUserId,
            publishedAt: new Date(),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/articles/${mainArticle.id}/related?limit=5`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(article => article.category.id === testCategoryId)).toBe(true);
      expect(response.body.data.every(article => article.id !== mainArticle.id)).toBe(true);
    });
  });

  describe('POST /articles', () => {
    const validArticleData = {
      title: 'New Test Article',
      excerpt: 'This is a comprehensive test article excerpt that meets all requirements',
      content: 'This is the detailed content of the new test article. It includes comprehensive information about the topic being covered and provides valuable insights to readers.',
      image: 'https://example.com/test-image.jpg',
      categoryId: testCategoryId,
      tagIds: testTagIds,
      isFeatured: false,
      isBreaking: false,
    };

    it('should create article with admin token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validArticleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validArticleData.title);
      expect(response.body.data.slug).toBe('new-test-article');
      expect(response.body.data.isActive).toBe(true);

      // Verify in database
      const article = await prisma.article.findUnique({
        where: { slug: 'new-test-article' },
      });
      expect(article).toBeTruthy();
      expect(article.title).toBe(validArticleData.title);
      expect(article.status).toBe(ArticleStatus.PUBLISHED);
    });

    it('should create article with author token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${authorToken}`)
        .send(validArticleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validArticleData.title);
    });

    it('should reject creation without token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/articles')
        .send(validArticleData)
        .expect(401);
    });

    it('should reject creation with user token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validArticleData)
        .expect(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Doğrulama hatası');
      expect(response.body.details).toBeDefined();
    });

    it('should validate title length', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validArticleData, title: 'A' })
        .expect(400);

      expect(response.body.details).toContain('Başlık en az 5 karakter olmalıdır');
    });

    it('should validate excerpt length', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validArticleData, excerpt: 'Too short' })
        .expect(400);

      expect(response.body.details).toContain('Özet en az 20 karakter olmalıdır');
    });

    it('should validate content length', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validArticleData, content: 'Too short content' })
        .expect(400);

      expect(response.body.details).toContain('İçerik en az 100 karakter olmalıdır');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validArticleData, categoryId: 999 })
        .expect(404);

      expect(response.body.message).toBe('Kategori bulunamadı');
    });

    it('should return 404 for non-existent tags', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validArticleData, tagIds: [999] })
        .expect(404);

      expect(response.body.message).toBe('Bir veya daha fazla etiket bulunamadı');
    });
  });

  describe('PATCH /articles/:id', () => {
    let articleId: number;
    let authorArticleId: number;

    beforeEach(async () => {
      const adminArticle = await prisma.article.create({
        data: {
          title: 'Admin Article',
          slug: 'admin-article',
          excerpt: 'This is an admin article excerpt with sufficient content for testing',
          content: 'This is the content of an admin article that can be updated.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId, // Admin user ID
          publishedAt: new Date(),
        },
      });
      articleId = adminArticle.id;

      const authorArticle = await prisma.article.create({
        data: {
          title: 'Author Article',
          slug: 'author-article',
          excerpt: 'This is an author article excerpt with sufficient content for testing',
          content: 'This is the content of an author article.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: authorUserId, // Author user ID
          publishedAt: new Date(),
        },
      });
      authorArticleId = authorArticle.id;
    });

    it('should update article with admin token', async () => {
      const updateData = {
        title: 'Updated Admin Article',
        excerpt: 'This is the updated admin article excerpt with sufficient content',
        content: 'This is the updated content of the admin article with comprehensive information.',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/articles/${articleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.slug).toBe('updated-admin-article');
      expect(response.body.data.excerpt).toBe(updateData.excerpt);
    });

    it('should allow author to update their own article', async () => {
      const updateData = {
        title: 'Updated Author Article',
        excerpt: 'This is the updated author article excerpt with sufficient content',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/articles/${authorArticleId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should reject update without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/articles/${articleId}`)
        .send({ title: 'Unauthorized Update' })
        .expect(401);
    });

    it('should return 404 for non-existent article', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/articles/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Non-existent Update' })
        .expect(404);
    });
  });

  describe('DELETE /articles/:id', () => {
    let articleId: number;

    beforeEach(async () => {
      const article = await prisma.article.create({
        data: {
          title: 'Article to Delete',
          slug: 'article-to-delete',
          excerpt: 'This is an article that will be deleted during testing',
          content: 'This is the content of an article that will be deleted.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });
      articleId = article.id;
    });

    it('should delete article with admin token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/articles/${articleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Makale başarıyla silindi');

      // Verify deletion in database
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      expect(article).toBeNull();
    });

    it('should reject deletion without token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/articles/${articleId}`)
        .expect(401);
    });

    it('should return 404 for non-existent article', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/articles/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /articles/:id/toggle-active', () => {
    let articleId: number;

    beforeEach(async () => {
      const article = await prisma.article.create({
        data: {
          title: 'Toggle Article',
          slug: 'toggle-article',
          excerpt: 'This is an article for testing the toggle active functionality',
          content: 'This is the content of an article that will have its status toggled.',
          status: ArticleStatus.PUBLISHED,
          categoryId: testCategoryId,
          authorId: adminUserId,
          publishedAt: new Date(),
        },
      });
      articleId = article.id;
    });

    it('should toggle active status with admin token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/articles/${articleId}/toggle-active`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(false);

      // Verify in database
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      expect(article.status).toBe(ArticleStatus.DRAFT);
    });

    it('should reject toggle without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/articles/${articleId}/toggle-active`)
        .expect(401);
    });

    it('should reject toggle with insufficient permissions', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/articles/${articleId}/toggle-active`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});