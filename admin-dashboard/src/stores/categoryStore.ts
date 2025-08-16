import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoryService, CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, PaginatedResponse } from '../services';

// Store state interface'i
interface CategoryState {
  // Data
  categories: CategoryResponse[];
  activeCategories: CategoryResponse[];
  selectedCategory: CategoryResponse | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchCategories: (page?: number, limit?: number) => Promise<void>;
  fetchActiveCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<boolean>;
  updateCategory: (id: number, data: UpdateCategoryRequest) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  toggleCategoryActive: (id: number) => Promise<boolean>;
  
  // Utility actions
  setSelectedCategory: (category: CategoryResponse | null) => void;
  clearError: () => void;
  resetPagination: () => void;
}

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export const useCategoryStore = create<CategoryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      activeCategories: [],
      selectedCategory: null,
      pagination: initialPagination,
      loading: false,
      loadingCreate: false,
      loadingUpdate: false,
      loadingDelete: false,
      error: null,

      // Actions
      fetchCategories: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response: any = await categoryService.getCategories(page, limit);
          
          // Backend'den gelen format: { data: { data: [...], page, limit, total, totalPages } }
          const categories = response.data?.data || [];
          const pagination = {
            page: response.data?.page || 1,
            limit: response.data?.limit || 10,
            total: response.data?.total || 0,
            totalPages: response.data?.totalPages || 0,
          };
          
          set({
            categories,
            pagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategoriler yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchActiveCategories: async () => {
        set({ loading: true, error: null });
        try {
          const categories = await categoryService.getActiveCategories();
          set({
            activeCategories: categories,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Aktif kategoriler yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchCategoryById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const category = await categoryService.getCategoryById(id);
          set({
            selectedCategory: category,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      createCategory: async (data: CreateCategoryRequest) => {
        set({ loadingCreate: true, error: null });
        try {
          const newCategory = await categoryService.createCategory(data);
          
          // Kategoriler listesini güncelle
          const { categories } = get();
          set({
            categories: [newCategory, ...categories],
            loadingCreate: false,
          });

          // Aktif kategoriler listesini de güncelle (eğer yeni kategori aktifse)
          if (newCategory.isActive) {
            const { activeCategories } = get();
            set({
              activeCategories: [newCategory, ...activeCategories],
            });
          }

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori oluşturulurken hata oluştu',
            loadingCreate: false,
          });
          return false;
        }
      },

      updateCategory: async (id: number, data: UpdateCategoryRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          const updatedCategory = await categoryService.updateCategory(id, data);
          
          // Kategoriler listesini güncelle
          const { categories } = get();
          const updatedCategories = categories.map(cat =>
            cat.id === id ? updatedCategory : cat
          );
          
          // Aktif kategoriler listesini güncelle
          const { activeCategories } = get();
          let updatedActiveCategories = activeCategories.map(cat =>
            cat.id === id ? updatedCategory : cat
          );

          // Eğer kategori pasif hale getirildiyse aktif listesinden kaldır
          if (!updatedCategory.isActive) {
            updatedActiveCategories = updatedActiveCategories.filter(cat => cat.id !== id);
          } else if (!activeCategories.find(cat => cat.id === id)) {
            // Eğer kategori aktif hale getirildiyse ve listede yoksa ekle
            updatedActiveCategories = [updatedCategory, ...updatedActiveCategories];
          }

          set({
            categories: updatedCategories,
            activeCategories: updatedActiveCategories,
            selectedCategory: updatedCategory,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori güncellenirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      deleteCategory: async (id: number) => {
        set({ loadingDelete: true, error: null });
        try {
          await categoryService.deleteCategory(id);
          
          // Kategorileri listelerden kaldır
          const { categories, activeCategories } = get();
          set({
            categories: categories.filter(cat => cat.id !== id),
            activeCategories: activeCategories.filter(cat => cat.id !== id),
            selectedCategory: null,
            loadingDelete: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori silinirken hata oluştu',
            loadingDelete: false,
          });
          return false;
        }
      },

      toggleCategoryActive: async (id: number) => {
        set({ loadingUpdate: true, error: null });
        try {
          const updatedCategory = await categoryService.toggleCategoryActive(id);
          
          // Kategoriler listesini güncelle
          const { categories } = get();
          const updatedCategories = categories.map(cat =>
            cat.id === id ? updatedCategory : cat
          );
          
          // Aktif kategoriler listesini güncelle
          const { activeCategories } = get();
          let updatedActiveCategories;
          
          if (updatedCategory.isActive) {
            // Aktif hale geldi, listeye ekle
            updatedActiveCategories = [updatedCategory, ...activeCategories.filter(cat => cat.id !== id)];
          } else {
            // Pasif hale geldi, listeden kaldır
            updatedActiveCategories = activeCategories.filter(cat => cat.id !== id);
          }

          set({
            categories: updatedCategories,
            activeCategories: updatedActiveCategories,
            selectedCategory: updatedCategory,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori durumu değiştirilirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      // Utility actions
      setSelectedCategory: (category: CategoryResponse | null) => {
        set({ selectedCategory: category });
      },

      clearError: () => {
        set({ error: null });
      },

      resetPagination: () => {
        set({ pagination: initialPagination });
      },
    }),
    {
      name: 'category-store', // DevTools'da görünecek isim
    }
  )
);