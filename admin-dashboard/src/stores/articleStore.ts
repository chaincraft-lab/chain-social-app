import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleService } from '../services';
import { 
  ArticleResponse, 
  CreateArticleRequest, 
  UpdateArticleRequest, 
  ArticleFilters,
  ArticleStats,
  PaginatedResponse 
} from '../services';

// Store state interface'i
interface ArticleState {
  // Data
  articles: ArticleResponse[];
  featuredArticles: ArticleResponse[];
  breakingArticles: ArticleResponse[];
  selectedArticle: ArticleResponse | null;
  articleStats: ArticleStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: ArticleFilters;

  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingStats: boolean;
  loadingUpload: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchArticles: (page?: number, limit?: number, filters?: ArticleFilters) => Promise<void>;
  fetchArticlesForAdmin: (page?: number, limit?: number, filters?: ArticleFilters) => Promise<void>;
  fetchFeaturedArticles: (page?: number, limit?: number) => Promise<void>;
  fetchBreakingArticles: (page?: number, limit?: number) => Promise<void>;
  fetchArticleById: (id: number) => Promise<void>;
  fetchArticleBySlug: (slug: string) => Promise<void>;
  fetchArticlesByCategory: (categoryId: number, page?: number, limit?: number) => Promise<void>;
  fetchArticlesByAuthor: (authorId: number, page?: number, limit?: number) => Promise<void>;
  createArticle: (data: CreateArticleRequest) => Promise<boolean>;
  updateArticle: (id: number, data: UpdateArticleRequest) => Promise<boolean>;
  deleteArticle: (id: number) => Promise<boolean>;
  toggleArticleActive: (id: number) => Promise<boolean>;
  toggleArticleLike: (id: number) => Promise<boolean>;
  incrementViewCount: (id: number) => Promise<boolean>;
  fetchArticleStats: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  getRelatedArticles: (id: number, limit?: number) => Promise<ArticleResponse[]>;
  
  // Utility actions
  setSelectedArticle: (article: ArticleResponse | null) => void;
  setFilters: (filters: ArticleFilters) => void;
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

const initialFilters: ArticleFilters = {};

export const useArticleStore = create<ArticleState>()(
  devtools(
    (set, get) => ({
      // Initial state
      articles: [],
      featuredArticles: [],
      breakingArticles: [],
      selectedArticle: null,
      articleStats: null,
      pagination: initialPagination,
      filters: initialFilters,
      loading: false,
      loadingCreate: false,
      loadingUpdate: false,
      loadingDelete: false,
      loadingStats: false,
      loadingUpload: false,
      error: null,

      // Actions
      fetchArticles: async (page = 1, limit = 10, filters?: ArticleFilters) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getArticles(page, limit, filters);
          
          // Backend'den gelen format: { data: { data: [...], page, limit, total, totalPages } }
          const articles = response.data?.data || [];
          const pagination = {
            page: response.data?.page || 1,
            limit: response.data?.limit || 10,
            total: response.data?.total || 0,
            totalPages: response.data?.totalPages || 0,
          };
          
          set({
            articles,
            pagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makaleler yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchArticlesForAdmin: async (page = 1, limit = 10, filters?: ArticleFilters) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getArticlesForAdmin(page, limit, filters);
          
          // Backend'den gelen format: { data: { data: [...], page, limit, total, totalPages } }
          const articles = response.data?.data || [];
          const pagination = {
            page: response.data?.page || 1,
            limit: response.data?.limit || 10,
            total: response.data?.total || 0,
            totalPages: response.data?.totalPages || 0,
          };
          
          set({
            articles,
            pagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Admin makaleleri yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchFeaturedArticles: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getFeaturedArticles(page, limit);
          const articles = response.data?.data || [];
          
          set({
            featuredArticles: articles,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Öne çıkan makaleler yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchBreakingArticles: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getBreakingArticles(page, limit);
          const articles = response.data?.data || [];
          
          set({
            breakingArticles: articles,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Son dakika haberleri yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchArticleById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const article = await articleService.getArticleById(id);
          set({
            selectedArticle: article,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchArticleBySlug: async (slug: string) => {
        set({ loading: true, error: null });
        try {
          const article = await articleService.getArticleBySlug(slug);
          set({
            selectedArticle: article,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchArticlesByCategory: async (categoryId: number, page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getArticlesByCategory(categoryId, page, limit);
          const articles = response.data?.data || [];
          
          set({
            articles,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kategori makaleleri yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchArticlesByAuthor: async (authorId: number, page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response: any = await articleService.getArticlesByAuthor(authorId, page, limit);
          const articles = response.data?.data || [];
          
          set({
            articles,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Yazar makaleleri yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      createArticle: async (data: CreateArticleRequest) => {
        set({ loadingCreate: true, error: null });
        try {
          const response: any = await articleService.createArticle(data);
          const newArticle = response.data || response;
          
          // Makaleler listesini güncelle
          const { articles } = get();
          set({
            articles: [newArticle, ...articles],
            loadingCreate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale oluşturulurken hata oluştu',
            loadingCreate: false,
          });
          return false;
        }
      },

      updateArticle: async (id: number, data: UpdateArticleRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          const response: any = await articleService.updateArticle(id, data);
          const updatedArticle = response.data || response;
          
          // Makaleler listesini güncelle
          const { articles } = get();
          const updatedArticles = articles.map(article =>
            article.id === id ? updatedArticle : article
          );

          set({
            articles: updatedArticles,
            selectedArticle: updatedArticle,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale güncellenirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      deleteArticle: async (id: number) => {
        set({ loadingDelete: true, error: null });
        try {
          await articleService.deleteArticle(id);
          
          // Makaleleri listelerden kaldır
          const { articles, featuredArticles, breakingArticles } = get();
          set({
            articles: articles.filter(article => article.id !== id),
            featuredArticles: featuredArticles.filter(article => article.id !== id),
            breakingArticles: breakingArticles.filter(article => article.id !== id),
            selectedArticle: null,
            loadingDelete: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale silinirken hata oluştu',
            loadingDelete: false,
          });
          return false;
        }
      },

      toggleArticleActive: async (id: number) => {
        set({ loadingUpdate: true, error: null });
        try {
          const response: any = await articleService.toggleArticleActive(id);
          const updatedArticle = response.data || response;
          
          // Makaleler listesini güncelle
          const { articles } = get();
          const updatedArticles = articles.map(article =>
            article.id === id ? updatedArticle : article
          );

          set({
            articles: updatedArticles,
            selectedArticle: updatedArticle,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale aktiflik durumu değiştirilirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      toggleArticleLike: async (id: number) => {
        try {
          const result = await articleService.toggleArticleLike(id);
          
          // Makaleler listesini güncelle
          const { articles } = get();
          const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, likeCount: result.likeCount } : article
          );

          set({ articles: updatedArticles });
          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Makale beğeni durumu değiştirilirken hata oluştu',
          });
          return false;
        }
      },

      incrementViewCount: async (id: number) => {
        try {
          const result = await articleService.incrementViewCount(id);
          
          // Makaleler listesini güncelle
          const { articles } = get();
          const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, viewCount: result.viewCount } : article
          );

          set({ articles: updatedArticles });
          return true;
        } catch (error: any) {
          return false;
        }
      },

      fetchArticleStats: async () => {
        set({ loadingStats: true, error: null });
        try {
          const stats = await articleService.getArticleStats();
          set({
            articleStats: stats,
            loadingStats: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'İstatistikler yüklenirken hata oluştu',
            loadingStats: false,
          });
        }
      },

      uploadImage: async (file: File) => {
        set({ loadingUpload: true, error: null });
        try {
          const result = await articleService.uploadImage(file);
          set({ loadingUpload: false });
          return result.url;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Resim yüklenirken hata oluştu',
            loadingUpload: false,
          });
          return null;
        }
      },

      getRelatedArticles: async (id: number, limit: number = 5) => {
        try {
          const articles = await articleService.getRelatedArticles(id, limit);
          return articles;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'İlgili makaleler yüklenirken hata oluştu',
          });
          return [];
        }
      },

      // Utility actions
      setSelectedArticle: (article: ArticleResponse | null) => {
        set({ selectedArticle: article });
      },

      setFilters: (filters: ArticleFilters) => {
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
      name: 'article-store', // DevTools'da görünecek isim
    }
  )
);