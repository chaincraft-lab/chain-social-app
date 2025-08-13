import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // Test user tokens
  let adminToken: string;
  let userToken: string;

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
    // Clean categories before each test
    await prisma.category.deleteMany();
  });

  async function cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('E2E tests should only run in test environment');
    }

    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }

  async function seedTestData() {
    // Create test admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'hashedpassword', // In real app, this would be hashed
        role: UserRole.ADMIN,
      },
    });

    // Create test regular user
    const regularUser = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@test.com',
        password: 'hashedpassword',
        role: UserRole.USER,
      },
    });

    // Generate JWT tokens
    adminToken = jwtService.sign({ 
      sub: adminUser.id, 
      email: adminUser.email, 
      role: adminUser.role 
    });
    
    userToken = jwtService.sign({ 
      sub: regularUser.id, 
      email: regularUser.email, 
      role: regularUser.role 
    });
  }

  describe('GET /categories/active', () => {
    it('should return empty array when no active categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories/active')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return only active categories', async () => {
      // Create test categories
      await prisma.category.createMany({
        data: [
          { name: 'Aktif Kategori', slug: 'aktif-kategori', isActive: true },
          { name: 'Pasif Kategori', slug: 'pasif-kategori', isActive: false },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/categories/active')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Aktif Kategori');
      expect(response.body.data[0].articleCount).toBe(0);
    });
  });

  describe('GET /categories', () => {
    it('should return paginated categories', async () => {
      // Create 15 test categories
      const categories = Array.from({ length: 15 }, (_, i) => ({
        name: `Kategori ${i + 1}`,
        slug: `kategori-${i + 1}`,
        isActive: true,
      }));

      await prisma.category.createMany({ data: categories });

      const response = await request(app.getHttpServer())
        .get('/api/v1/categories?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(10);
      expect(response.body.data.total).toBe(15);
      expect(response.body.data.totalPages).toBe(2);
      expect(response.body.data.hasNext).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      // Create 5 test categories
      const categories = Array.from({ length: 5 }, (_, i) => ({
        name: `Kategori ${i + 1}`,
        slug: `kategori-${i + 1}`,
        isActive: true,
      }));

      await prisma.category.createMany({ data: categories });

      const response = await request(app.getHttpServer())
        .get('/api/v1/categories?page=2&limit=3')
        .expect(200);

      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.page).toBe(2);
      expect(response.body.data.limit).toBe(3);
      expect(response.body.data.hasPrevious).toBe(true);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return category by id', async () => {
      const category = await prisma.category.create({
        data: {
          name: 'Test Kategori',
          slug: 'test-kategori',
          description: 'Test açıklaması',
          isActive: true,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/categories/${category.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Kategori');
      expect(response.body.data.slug).toBe('test-kategori');
      expect(response.body.data.description).toBe('Test açıklaması');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Kategori bulunamadı');
    });

    it('should return 404 for inactive category', async () => {
      const category = await prisma.category.create({
        data: {
          name: 'Pasif Kategori',
          slug: 'pasif-kategori',
          isActive: false,
        },
      });

      await request(app.getHttpServer())
        .get(`/api/v1/categories/${category.id}`)
        .expect(404);
    });
  });

  describe('GET /categories/slug/:slug', () => {
    it('should return category by slug', async () => {
      await prisma.category.create({
        data: {
          name: 'Test Kategori',
          slug: 'test-kategori',
          isActive: true,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/categories/slug/test-kategori')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Kategori');
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/categories/slug/nonexistent')
        .expect(404);
    });
  });

  describe('POST /categories', () => {
    const validCategoryData = {
      name: 'Yeni Kategori',
      description: 'Yeni kategori açıklaması',
      color: '#007bff',
      icon: 'mdi-test',
    };

    it('should create category with admin token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validCategoryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(validCategoryData.name);
      expect(response.body.data.slug).toBe('yeni-kategori');
      expect(response.body.data.description).toBe(validCategoryData.description);

      // Verify in database
      const category = await prisma.category.findUnique({
        where: { slug: 'yeni-kategori' },
      });
      expect(category).toBeTruthy();
      expect(category.name).toBe(validCategoryData.name);
    });

    it('should reject creation without token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/categories')
        .send(validCategoryData)
        .expect(401);
    });

    it('should reject creation with user token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validCategoryData)
        .expect(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Doğrulama hatası');
      expect(response.body.details).toBeDefined();
    });

    it('should validate name length', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'A' }) // Too short
        .expect(400);

      expect(response.body.details).toContain('Kategori adı en az 2 karakter olmalıdır');
    });

    it('should validate color format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Valid Name',
          color: 'invalid-color',
        })
        .expect(400);

      expect(response.body.details).toContain('Geçerli bir hex renk kodu giriniz (örn: #007bff)');
    });

    it('should prevent duplicate names', async () => {
      // First creation
      await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validCategoryData)
        .expect(201);

      // Second creation with same name
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validCategoryData)
        .expect(409);

      expect(response.body.message).toBe('Bu isimde bir kategori zaten mevcut');
    });
  });

  describe('PATCH /categories/:id', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await prisma.category.create({
        data: {
          name: 'Eski Kategori',
          slug: 'eski-kategori',
          description: 'Eski açıklama',
          isActive: true,
        },
      });
      categoryId = category.id;
    });

    it('should update category with admin token', async () => {
      const updateData = {
        name: 'Güncellenmiş Kategori',
        description: 'Güncellenmiş açıklama',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.slug).toBe('guncelllenmis-kategori');
      expect(response.body.data.description).toBe(updateData.description);
    });

    it('should reject update without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/categories/${categoryId}`)
        .send({ name: 'New Name' })
        .expect(401);
    });

    it('should return 404 for non-existent category', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/categories/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name' })
        .expect(404);
    });
  });

  describe('DELETE /categories/:id', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await prisma.category.create({
        data: {
          name: 'Silinecek Kategori',
          slug: 'silinecek-kategori',
          isActive: true,
        },
      });
      categoryId = category.id;
    });

    it('should delete category with admin token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Kategori başarıyla silindi');

      // Verify deletion in database
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      expect(category).toBeNull();
    });

    it('should reject deletion without token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/categories/${categoryId}`)
        .expect(401);
    });

    it('should return 404 for non-existent category', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/categories/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /categories/:id/toggle-active', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await prisma.category.create({
        data: {
          name: 'Toggle Kategori',
          slug: 'toggle-kategori',
          isActive: true,
        },
      });
      categoryId = category.id;
    });

    it('should toggle active status with admin token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/categories/${categoryId}/toggle-active`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(false);

      // Verify in database
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      expect(category.isActive).toBe(false);
    });

    it('should reject toggle without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/categories/${categoryId}/toggle-active`)
        .expect(401);
    });
  });
});