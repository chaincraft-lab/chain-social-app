import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
    };

    const mockCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a category successfully', async () => {
      // Arrange
      mockPrismaService.category.findMany.mockResolvedValue([]);
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      // Act
      const result = await service.create(createCategoryDto);

      // Assert
      expect(result).toEqual({
        id: mockCategory.id,
        name: mockCategory.name,
        slug: mockCategory.slug,
        description: mockCategory.description,
        color: mockCategory.color,
        icon: mockCategory.icon,
        isActive: mockCategory.isActive,
        createdAt: mockCategory.createdAt,
        updatedAt: mockCategory.updatedAt,
      });

      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: createCategoryDto.name,
          slug: 'teknoloji',
          description: createCategoryDto.description,
          color: createCategoryDto.color,
          icon: createCategoryDto.icon,
        },
      });
    });

    it('should throw ConflictException when category name already exists', async () => {
      // Arrange
      mockPrismaService.category.findMany.mockResolvedValue([]);
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      // Act & Assert
      await expect(service.create(createCategoryDto)).rejects.toThrow(
        new ConflictException('Bu isimde bir kategori zaten mevcut'),
      );
    });

    it('should generate unique slug when base slug exists', async () => {
      // Arrange
      mockPrismaService.category.findMany.mockResolvedValue([
        { slug: 'teknoloji' },
        { slug: 'teknoloji-1' },
      ]);
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue({
        ...mockCategory,
        slug: 'teknoloji-2',
      });

      // Act
      await service.create(createCategoryDto);

      // Assert
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: createCategoryDto.name,
          slug: 'teknoloji-2',
          description: createCategoryDto.description,
          color: createCategoryDto.color,
          icon: createCategoryDto.icon,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      // Arrange
      const paginationDto = { page: 1, limit: 10 };
      const mockCategories = [
        {
          id: 1,
          name: 'Teknoloji',
          slug: 'teknoloji',
          description: 'Teknoloji haberleri',
          color: '#007bff',
          icon: 'mdi-laptop',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { articles: 5 },
        },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
      mockPrismaService.category.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(paginationDto);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.data[0].articleCount).toBe(5);
    });
  });

  describe('findOne', () => {
    const mockCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { articles: 5 },
    };

    it('should return a category by id', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result.id).toBe(1);
      expect(result.articleCount).toBe(5);
    });

    it('should throw NotFoundException when category not found', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });

    it('should throw NotFoundException when category is inactive', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        isActive: false,
      });

      // Act & Assert
      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });

  describe('findBySlug', () => {
    const mockCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { articles: 5 },
    };

    it('should return a category by slug', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      // Act
      const result = await service.findBySlug('teknoloji');

      // Assert
      expect(result.slug).toBe('teknoloji');
      expect(result.articleCount).toBe(5);
    });

    it('should throw NotFoundException when category not found by slug', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Yeni Teknoloji',
      description: 'Güncellenmiş açıklama',
    };

    const existingCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a category successfully', async () => {
      // Arrange
      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(existingCategory) // First call for existence check
        .mockResolvedValueOnce(null); // Second call for name uniqueness check
      mockPrismaService.category.findMany.mockResolvedValue([]);
      mockPrismaService.category.update.mockResolvedValue({
        ...existingCategory,
        name: updateCategoryDto.name,
        slug: 'yeni-teknoloji',
        description: updateCategoryDto.description,
      });

      // Act
      const result = await service.update(1, updateCategoryDto);

      // Assert
      expect(result.name).toBe(updateCategoryDto.name);
      expect(result.slug).toBe('yeni-teknoloji');
      expect(result.description).toBe(updateCategoryDto.description);
    });

    it('should throw NotFoundException when category to update does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, updateCategoryDto)).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });

    it('should throw ConflictException when new name already exists', async () => {
      // Arrange
      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(existingCategory) // First call for existence check
        .mockResolvedValueOnce({ id: 2, name: 'Yeni Teknoloji' }); // Second call for name uniqueness check

      // Act & Assert
      await expect(service.update(1, updateCategoryDto)).rejects.toThrow(
        new ConflictException('Bu isimde bir kategori zaten mevcut'),
      );
    });
  });

  describe('remove', () => {
    const mockCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      isActive: true,
      _count: { articles: 0 },
    };

    it('should delete a category successfully', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      // Act
      await service.remove(1);

      // Assert
      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when category to delete does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });

    it('should throw ConflictException when category has articles', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        _count: { articles: 5 },
      });

      // Act & Assert
      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException('Bu kategoriye ait makaleler olduğu için silinemez'),
      );
    });
  });

  describe('toggleActive', () => {
    const mockCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should toggle category active status', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        isActive: false,
      });

      // Act
      const result = await service.toggleActive(1);

      // Assert
      expect(result.isActive).toBe(false);
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.toggleActive(999)).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });
});