import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export const dashboardResolvers = {
  Query: {
    dashboard: async () => {
      return await dashboardService.getDashboardData();
    },
  },
  Mutation: {
    toggleUserBan: async (_: unknown, { userId }: { userId: string }) => {
      return await dashboardService.toggleUserBan(userId);
    },

    toggleCompanyBan: async (_: unknown, { companyId }: { companyId: string }) => {
      return await dashboardService.toggleCompanyBan(companyId);
    },

    approveCompany: async (_: unknown, { companyId }: { companyId: string }) => {
      return await dashboardService.approveCompany(companyId);
    },
  },
};
