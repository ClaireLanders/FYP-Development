//COMMENTS

import { useState, useEffect } from 'react';
import { analyticsService} from '@/services/analyticsService'
import type { BasicMetrics } from '@/services/types';

export const useAnalytics = (branchID: string, days:number = 30) => {
    const [metrics, setMetrics] = useState<BasicMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const fetchMetrics = async (): Promise<void> => {
        try{
            setLoading(true);
            setError(null);
            const data = await analyticsService.getBasicMetrics(branchID, days);
            setMetrics(data);
        } catch(err:any){
            setError(err.message || 'Failed to load metrics');
            console.error('Analytics error:', err);
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
    void fetchMetrics();
    }, [branchID, days]);

        return {
        metrics,
        loading,
        error,
        fetchMetrics
    };
};

// References
// TODO: add some !!