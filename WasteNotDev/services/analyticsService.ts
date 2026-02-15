// Analytics-related API calls
// Provides service function to fetch waste tracking metrics
// Communicates with backend GET /analytics/basic-metrics endpoint
// Used by store owners to track surplus food generation and rescue rates

import { api } from './api';
import type { BasicMetrics } from './types';

 // Getting  basic waste tracking metrics for a store branch
export const analyticsService = {
  getBasicMetrics: async (branchId: string, days: number = 30): Promise<BasicMetrics> => {
    const response = await api.get('/analytics/basic-metrics', {
      params: {
        branch_id: branchId,
        days,
      },
    });
    return response.data;
  },
};

