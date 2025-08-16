export interface UserResponse {
  id: number;
  uuid: string;
  name: string;
  surname?: string;
  username?: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  isBlocked?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  surname?: string;
  username?: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  role?: 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface UpdateUserRequest {
  name?: string;
  surname?: string;
  username?: string;
  avatar?: string;
  bio?: string;
}

export interface AdminUpdateUserRequest extends UpdateUserRequest {
  email?: string;
  role?: 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  isActive?: boolean;
  isBlocked?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  search?: string;
  role?: 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  isActive?: boolean;
  isBlocked?: boolean;
  includeDeleted?: boolean;
}

export interface UserStats {
  articlesCount: number;
  commentsCount: number;
  likesCount: number;
  bookmarksCount: number;
}