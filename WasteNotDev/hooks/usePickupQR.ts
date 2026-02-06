// TODO: Description and sources

import { useState, useEffect, useCallback } from 'react';
import { pickupService, PickupQRData } from '@/services/pickupService';

export const usePickupQR = (claimId: string, UserBranchId: string) => {
  const [qrData, setQrData] = useState<PickupQRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQR = useCallback(async () => {
    if (!claimId || !UserBranchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await pickupService.getPickupQR(claimId, UserBranchId);
      setQrData(data);
    } catch (err: any) {
      console.error('Error loading QR code:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to load QR code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [claimId, UserBranchId]);

  useEffect(() => {
    loadQR();
  }, [loadQR]);

  const refresh = useCallback(() => {
    loadQR();
  }, [loadQR]);

  return {
    qrData,
    loading,
    error,
    refresh
  };
};