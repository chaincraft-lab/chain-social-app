import { ApiService } from '../base/ApiService';

export interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalUsers: number;
  pendingComments: number;
  recentArticles: Array<{
    id: number;
    title: string;
    createdAt: string;
  }>;
  todayStats: {
    articlesCreated: number;
    commentsReceived: number;
    newUsers: number;
  };
}

class DashboardService extends ApiService {
  constructor() {
    super();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;