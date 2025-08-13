import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllActive: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
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

    const mockCategoryResponse = {
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

    it('should create a category', async () => {
      // Arrange
      mockCategoriesService.create.mockResolvedValue(mockCategoryResponse);

      // Act
      const result = await controller.create(createCategoryDto);

      // Assert
      expect(result).toEqual(mockCategoryResponse);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should handle creation conflicts', async () => {
      // Arrange
      mockCategoriesService.create.mockRejectedValue(
        new ConflictException('Bu isimde bir kategori zaten mevcut'),
      );

      // Act & Assert
      await expect(controller.create(createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const mockPaginatedResponse = {
      data: [
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
          articleCount: 5,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

    it('should return paginated categories', async () => {
      // Arrange
      mockCategoriesService.findAll.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.findAll(paginationDto);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findAllActive', () => {
    const mockActiveCategories = [
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
        articleCount: 5,
      },
    ];

    it('should return all active categories', async () => {
      // Arrange
      mockCategoriesService.findAllActive.mockResolvedValue(mockActiveCategories);

      // Act
      const result = await controller.findAllActive();

      // Assert
      expect(result).toEqual(mockActiveCategories);
      expect(service.findAllActive).toHaveBeenCalled();
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
      articleCount: 5,
    };

    it('should return a category by id', async () => {
      // Arrange
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      // Act
      const result = await controller.findOne(1);

      // Assert
      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle not found error', async () => {
      // Arrange
      mockCategoriesService.findOne.mockRejectedValue(
        new NotFoundException('Kategori bulunamadı'),
      );

      // Act & Assert
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
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
      articleCount: 5,
    };

    it('should return a category by slug', async () => {
      // Arrange
      mockCategoriesService.findBySlug.mockResolvedValue(mockCategory);

      // Act
      const result = await controller.findBySlug('teknoloji');

      // Assert
      expect(result).toEqual(mockCategory);
      expect(service.findBySlug).toHaveBeenCalledWith('teknoloji');
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Yeni Teknoloji',
      description: 'Güncellenmiş açıklama',
    };

    const mockUpdatedCategory = {
      id: 1,
      name: 'Yeni Teknoloji',
      slug: 'yeni-teknoloji',
      description: 'Güncellenmiş açıklama',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a category', async () => {
      // Arrange
      mockCategoriesService.update.mockResolvedValue(mockUpdatedCategory);

      // Act
      const result = await controller.update(1, updateCategoryDto);

      // Assert
      expect(result).toEqual(mockUpdatedCategory);
      expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should handle update conflicts', async () => {
      // Arrange
      mockCategoriesService.update.mockRejectedValue(
        new ConflictException('Bu isimde bir kategori zaten mevcut'),
      );

      // Act & Assert
      await expect(controller.update(1, updateCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      // Arrange
      mockCategoriesService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(1);

      // Assert
      expect(result).toEqual({ message: 'Kategori başarıyla silindi' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion conflicts', async () => {
      // Arrange
      mockCategoriesService.remove.mockRejectedValue(
        new ConflictException('Bu kategoriye ait makaleler olduğu için silinemez'),
      );

      // Act & Assert
      await expect(controller.remove(1)).rejects.toThrow(ConflictException);
    });
  });

  describe('toggleActive', () => {
    const mockToggledCategory = {
      id: 1,
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji haberleri',
      color: '#007bff',
      icon: 'mdi-laptop',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should toggle category active status', async () => {
      // Arrange
      mockCategoriesService.toggleActive.mockResolvedValue(mockToggledCategory);

      // Act
      const result = await controller.toggleActive(1);

      // Assert
      expect(result).toEqual(mockToggledCategory);
      expect(service.toggleActive).toHaveBeenCalledWith(1);
    });
  });
});