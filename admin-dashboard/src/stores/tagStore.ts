import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import tagService from '../services/tag/TagService';
import { 
  TagResponse, 
  TagWithArticles,
  CreateTagRequest, 
  UpdateTagRequest, 
  TagFilters,
  TagStats,
  PaginatedResponse 
} from '../services';

// Store state interface'i
interface TagState {
  // Data
  tags: TagResponse[];
  popularTags: TagResponse[];
  selectedTag: TagResponse | null;
  selectedTagWithArticles: TagWithArticles | null;
  tagStats: TagStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: TagFilters;

  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingStats: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchTags: (page?: number, limit?: number, filters?: TagFilters) => Promise<void>;
  fetchPopularTags: (limit?: number) => Promise<void>;
  searchTags: (query: string, limit?: number) => Promise<TagResponse[]>;
  fetchTagById: (id: number) => Promise<void>;
  fetchTagBySlug: (slug: string) => Promise<void>;
  createTag: (data: CreateTagRequest) => Promise<boolean>;
  updateTag: (id: number, data: UpdateTagRequest) => Promise<boolean>;
  deleteTag: (id: number) => Promise<boolean>;
  fetchTagStats: () => Promise<void>;
  
  // Utility actions
  setSelectedTag: (tag: TagResponse | null) => void;
  setFilters: (filters: TagFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
  resetPagination: () => void;
}

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const initialFilters: TagFilters = {};

export const useTagStore = create<TagState>()(
  devtools(
    (set, get) => ({
      // Initial state
      tags: [],
      popularTags: [],
      selectedTag: null,
      selectedTagWithArticles: null,
      tagStats: null,
      pagination: initialPagination,
      filters: initialFilters,
      loading: false,
      loadingCreate: false,
      loadingUpdate: false,
      loadingDelete: false,
      loadingStats: false,
      error: null,

      // Actions
      fetchTags: async (page = 1, limit = 10, filters?: TagFilters) => {
        set({ loading: true, error: null });
        try {
          const response: any = await tagService.getTags(page, limit, filters);
          
          // Backend'den gelen format: { data: { data: [...], page, limit, total, totalPages } }
          const tags = response.data?.data || [];
          const pagination = {
            page: response.data?.page || 1,
            limit: response.data?.limit || 10,
            total: response.data?.total || 0,
            totalPages: response.data?.totalPages || 0,
          };
          
          set({
            tags,
            pagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Taglar yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchPopularTags: async (limit = 10) => {
        set({ loading: true, error: null });
        try {
          const popularTags = await tagService.getPopularTags(limit);
          set({
            popularTags,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Popüler taglar yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      searchTags: async (query: string, limit = 10) => {
        try {
          const results = await tagService.searchTags(query, limit);
          return results;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag arama sırasında hata oluştu',
          });
          return [];
        }
      },

      fetchTagById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const tag = await tagService.getTagById(id);
          set({
            selectedTag: tag,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchTagBySlug: async (slug: string) => {
        set({ loading: true, error: null });
        try {
          const tagWithArticles = await tagService.getTagBySlug(slug);
          set({
            selectedTagWithArticles: tagWithArticles,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      createTag: async (data: CreateTagRequest) => {
        set({ loadingCreate: true, error: null });
        try {
          const response: any = await tagService.createTag(data);
          const newTag = response.data || response;
          
          // Taglar listesini güncelle
          const { tags } = get();
          set({
            tags: [newTag, ...tags],
            loadingCreate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag oluşturulurken hata oluştu',
            loadingCreate: false,
          });
          return false;
        }
      },

      updateTag: async (id: number, data: UpdateTagRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          const response: any = await tagService.updateTag(id, data);
          const updatedTag = response.data || response;
          
          // Taglar listesini güncelle
          const { tags } = get();
          const updatedTags = tags.map(tag =>
            tag.id === id ? updatedTag : tag
          );

          set({
            tags: updatedTags,
            selectedTag: updatedTag,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag güncellenirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      deleteTag: async (id: number) => {
        set({ loadingDelete: true, error: null });
        try {
          await tagService.deleteTag(id);
          
          // Tagları listelerden kaldır
          const { tags, popularTags } = get();
          set({
            tags: tags.filter(tag => tag.id !== id),
            popularTags: popularTags.filter(tag => tag.id !== id),
            selectedTag: null,
            loadingDelete: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Tag silinirken hata oluştu',
            loadingDelete: false,
          });
          return false;
        }
      },

      fetchTagStats: async () => {
        set({ loadingStats: true, error: null });
        try {
          const stats = await tagService.getTagStats();
          set({
            tagStats: stats,
            loadingStats: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'İstatistikler yüklenirken hata oluştu',
            loadingStats: false,
          });
        }
      },

      // Utility actions
      setSelectedTag: (tag: TagResponse | null) => {
        set({ selectedTag: tag });
      },

      setFilters: (filters: TagFilters) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      clearFilters: () => {
        set({ filters: initialFilters });
      },

      clearError: () => {
        set({ error: null });
      },

      resetPagination: () => {
        set({ pagination: initialPagination });
      },
    }),
    {
      name: 'tag-store', // DevTools'da görünecek isim
    }
  )
);