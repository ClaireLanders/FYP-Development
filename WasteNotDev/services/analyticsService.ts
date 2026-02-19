// Analytics-related API calls
// Provides service function to fetch waste tracking metrics
// Communicates with backend analytics endpoints
// Used by store owners to track surplus food generation and rescue rates

import { api } from './api';
import type {BasicMetrics, ChartResponse, ChatResponse} from './types';

 // Getting  basic waste tracking metrics for a store branch
export const analyticsService = {
  getBasicMetrics: async (
      branchID: string,
      periodType:string,
      referenceDate?: string): Promise<BasicMetrics> => {
    const response = await api.get('/analytics/basic-metrics', {
      params: {
        branch_id: branchID,
        period_type: periodType,
        reference_date: referenceDate
      }
    });
    return response.data;
  },

  // Get chart data
  // Returns a chart based on period type
  getChart: async(
      branchID:string,
      periodType:string ='month',
      referenceDate?: string): Promise<ChartResponse> =>{
    const response = await api.get('/analytics/chart', {
      params: {
        branch_id: branchID,
        period_type: periodType,
        reference_date: referenceDate
      }
    });
    return response.data;
  },

  // Asking AI a question about the analytics data
  askQuestion: async(
      branchID:string,
      question:string,
      periodType:string ='month',
      referenceDate?:string):Promise<ChatResponse> =>{
  const response = await api.post('/analytics/chat', {
      branch_id: branchID,
      question,
      period_type: periodType,
      reference_date: referenceDate
    });
    return response.data;
  }
};



