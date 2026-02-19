// Custom hook for analytics chart data
// Fetches chart visualisation data based on period type
// Automatically updates when time period changes

import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { Chart } from '@/services/types';

export const useAnalyticsChart = (branchID: string, periodType: string = 'month', referenceDate?: string) => {
  const [chart, setChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = async (): Promise<void> => {
    // Skip chart fetch for day period
    if (periodType === 'day') {
      setChart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getChart(branchID, periodType, referenceDate);
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
  }, [branchID, periodType, referenceDate]);

  return {
    chart,
    loading,
    error,
    fetchChart
  };
};

// REFERENCES
// React. (2025). useState Hook. Retrieved from react.dev/reference/react/useState
// React. (2025). useEffect Hook. Retrieved from react.dev/reference/react/useEffect