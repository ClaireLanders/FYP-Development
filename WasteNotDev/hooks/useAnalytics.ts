// Custom React hook for fetching and managing analytics metrics (US7 & US8).
// Manages: metrics data, loading state, error state, and time period selection.
// Period types supported: day, week, month, year.
// Re-fetches automatically when branchID, periodType, or referenceDate changes.
// React useState: (React Native, 2025)
// React useEffect: (React Native, 2025)

import { useState, useEffect } from 'react';
import { analyticsService} from '@/services/analyticsService'
import type { BasicMetrics } from '@/services/types';

export const useAnalytics = (branchID: string) => {
    const [metrics, setMetrics] = useState<BasicMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    // Time period state, defaulting to day and today's date
    const [periodType, setPeriodType] = useState<'day'|'week' | 'month' | 'year'>('day');
    const [referenceDate, setReferenceDate] = useState<string | undefined>(undefined);

    const fetchMetrics = async (): Promise<void> => {
        try{
            setLoading(true);
            setError(null);
            const data = await analyticsService.getBasicMetrics(branchID, periodType, referenceDate);
            setMetrics(data);
        } catch(err:any){
            setError(err.message || 'Failed to load metrics');
            console.error('Analytics error:', err);
        }finally{
            setLoading(false);
        }
    };
    // fetching metrics when branch, period type, or reference date changes
    useEffect(() => {
    void fetchMetrics();
    }, [branchID, periodType, referenceDate]);

        return {
        metrics,
        loading,
        error,
        fetchMetrics,
        setPeriodType,
        referenceDate,
        setReferenceDate,
        periodType,
    };
};

