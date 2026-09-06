import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export const dashboardResolvers = {
  Query: {
    dashboard: async () => {
      return await dashboardService.getDashboardData();
    },
  },
};
