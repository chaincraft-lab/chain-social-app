export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  uuid: string;
  email: string;
  name: string;
  surname?: string;
  username?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  access_token?: string;
}

export interface RefreshTokenResponse {
  token: string;
}