// Custom hook for analytics data
// Manages metrics, loading states, and time period selection
// Supports week, month, and year views

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
        setReferenceDate
    };
};

// References
// TODO: add some !!