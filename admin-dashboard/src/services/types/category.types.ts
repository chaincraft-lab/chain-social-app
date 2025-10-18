export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  website?: string;
  tokenSymbol?: string;
  blockchain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  articleCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  website?: string;
  tokenSymbol?: string;
  blockchain?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}