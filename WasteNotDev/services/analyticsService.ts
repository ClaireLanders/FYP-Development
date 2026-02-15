// Analytics-related API calls
// Provides service function to fetch waste tracking metrics
// Communicates with backend GET /analytics/basic-metrics endpoint
// Used by store owners to track surplus food generation and rescue rates

import { api } from './api';
import type {BasicMetrics, GenerateChartResponse, ChatResponse} from './types';

 // Getting  basic waste tracking metrics for a store branch
export const analyticsService = {
  getBasicMetrics: async (branchID: string, days: number = 30): Promise<BasicMetrics> => {
    const response = await api.get('/analytics/basic-metrics', {
      params: {
        branch_id: branchID,
        days,
      },
    });
    return response.data;
  },
  // Generating chart with AI
  generateChart: async (branchID: string, days: number=30):Promise<GenerateChartResponse> => {
    const response = await api.post('/analytics/generate-chart', {
      branch_id: branchID,
      days
    });
    return response.data;
  },
  // Asking AI a question about the analytics data
  askQuestion: async(branchID:string, question:string, days: number=30):Promise<ChatResponse> =>{
    const response = await api.post('/analytics/chat', {
      branch_id:branchID,
      question,
      days
    });
    return response.data;
  }
};

