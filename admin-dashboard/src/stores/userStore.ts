import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userService } from '../services';
import { 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  AdminUpdateUserRequest,
  ChangePasswordRequest,
  UserFilters,
  UserStats,
  PaginatedResponse 
} from '../services';

// Store state interface'i
interface UserState {
  // Data
  users: UserResponse[];
  selectedUser: UserResponse | null;
  currentProfile: UserResponse | null;
  userStats: UserStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: UserFilters;

  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingStats: boolean;
  loadingBlock: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchUsers: (page?: number, limit?: number, filters?: UserFilters) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  fetchUserByUuid: (uuid: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchUserStats: (id: number) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<boolean>;
  updateUser: (id: number, data: AdminUpdateUserRequest) => Promise<boolean>;
  updateProfile: (data: UpdateUserRequest) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  toggleUserBlock: (id: number) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  
  // Utility actions
  setSelectedUser: (user: UserResponse | null) => void;
  setFilters: (filters: UserFilters) => void;
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

const initialFilters: UserFilters = {};

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      selectedUser: null,
      currentProfile: null,
      userStats: null,
      pagination: initialPagination,
      filters: initialFilters,
      loading: false,
      loadingCreate: false,
      loadingUpdate: false,
      loadingDelete: false,
      loadingStats: false,
      loadingBlock: false,
      error: null,

      // Actions
      fetchUsers: async (page = 1, limit = 10, filters?: UserFilters) => {
        set({ loading: true, error: null });
        try {
          const response: any = await userService.getUsers(page, limit, filters);
          
          // Backend'den gelen format: { data: { data: [...], page, limit, total, totalPages } }
          const users = response.data?.data || [];
          const pagination = {
            page: response.data?.page || 1,
            limit: response.data?.limit || 10,
            total: response.data?.total || 0,
            totalPages: response.data?.totalPages || 0,
          };
          
          set({
            users,
            pagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcılar yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchUserById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const user = await userService.getUserById(id);
          set({
            selectedUser: user,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchUserByUuid: async (uuid: string) => {
        set({ loading: true, error: null });
        try {
          const user = await userService.getUserByUuid(uuid);
          set({
            selectedUser: user,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const profile = await userService.getProfile();
          set({
            currentProfile: profile,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Profil yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      fetchUserStats: async (id: number) => {
        set({ loadingStats: true, error: null });
        try {
          const stats = await userService.getUserStats(id);
          set({
            userStats: stats,
            loadingStats: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'İstatistikler yüklenirken hata oluştu',
            loadingStats: false,
          });
        }
      },

      createUser: async (data: CreateUserRequest) => {
        set({ loadingCreate: true, error: null });
        try {
          const response: any = await userService.createUser(data);
          const newUser = response.data || response;
          
          // Kullanıcılar listesini güncelle
          const { users } = get();
          set({
            users: [newUser, ...users],
            loadingCreate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı oluşturulurken hata oluştu',
            loadingCreate: false,
          });
          return false;
        }
      },

      updateUser: async (id: number, data: AdminUpdateUserRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          const response: any = await userService.updateUser(id, data);
          const updatedUser = response.data || response;
          
          // Kullanıcılar listesini güncelle
          const { users } = get();
          const updatedUsers = users.map(user =>
            user.id === id ? updatedUser : user
          );

          set({
            users: updatedUsers,
            selectedUser: updatedUser,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı güncellenirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      updateProfile: async (data: UpdateUserRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          const response: any = await userService.updateProfile(data);
          const updatedProfile = response.data || response;
          
          set({
            currentProfile: updatedProfile,
            loadingUpdate: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Profil güncellenirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      changePassword: async (data: ChangePasswordRequest) => {
        set({ loadingUpdate: true, error: null });
        try {
          await userService.changePassword(data);
          set({ loadingUpdate: false });
          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Şifre değiştirilirken hata oluştu',
            loadingUpdate: false,
          });
          return false;
        }
      },

      toggleUserBlock: async (id: number) => {
        set({ loadingBlock: true, error: null });
        try {
          const response: any = await userService.toggleUserBlock(id);
          const updatedUser = response.data || response;
          
          // Kullanıcılar listesini güncelle
          const { users } = get();
          const updatedUsers = users.map(user =>
            user.id === id ? updatedUser : user
          );

          set({
            users: updatedUsers,
            selectedUser: updatedUser,
            loadingBlock: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı blok durumu değiştirilirken hata oluştu',
            loadingBlock: false,
          });
          return false;
        }
      },

      deleteUser: async (id: number) => {
        set({ loadingDelete: true, error: null });
        try {
          await userService.deleteUser(id);
          
          // Kullanıcıyı listeden kaldır
          const { users } = get();
          set({
            users: users.filter(user => user.id !== id),
            selectedUser: null,
            loadingDelete: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Kullanıcı silinirken hata oluştu',
            loadingDelete: false,
          });
          return false;
        }
      },

      // Utility actions
      setSelectedUser: (user: UserResponse | null) => {
        set({ selectedUser: user });
      },

      setFilters: (filters: UserFilters) => {
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
      name: 'user-store', // DevTools'da görünecek isim
    }
  )
);