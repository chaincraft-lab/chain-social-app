export interface IUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface IUpdateUserDto {
  name?: string;
  avatar?: string;
  bio?: string;
}