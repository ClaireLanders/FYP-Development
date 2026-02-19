// Custom hook for analytics chart data
// Fetches chart visualisation data based on period type
// Automatically updates when period changes

import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { Chart } from '@/services/types';

export const useAnalyticsChart = (branchId: string, periodType: string = 'month', referenceDate?: string) => {
  const [chart, setChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getChart(branchId, periodType, referenceDate);
      setChart(response.chart);
    } catch (err: any) {
      setError(err.message || 'Failed to load chart');
      console.error('Chart error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetching chart when branch, period type, or reference date changes
  useEffect(() => {
    void fetchChart();
  }, [branchId, periodType, referenceDate]);

  return {
    chart,
    loading,
    error,
    fetchChart
  };
};
