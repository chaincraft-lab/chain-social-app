export interface TagResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  articlesCount?: number;
}

export interface TagWithArticles extends TagResponse {
  articles?: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    publishedAt?: string;
    categoryName: string;
    authorName: string;
  }>;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}

export interface TagFilters {
  search?: string;
  sortByArticleCount?: boolean;
}

export interface TagStats {
  totalTags: number;
  tagsWithArticles: number;
  mostUsedTag: TagResponse | null;
  averageArticlesPerTag: number;
}