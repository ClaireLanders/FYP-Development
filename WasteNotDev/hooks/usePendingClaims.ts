// Custom hook for managing pending claims and approved claims awaiting pickup
// Fetches pending claims for approval and approved claims waiting for pickup
// Provides functions to approve claims and refresh data
// Manages loading states and error handling
// TODO: add sources?

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { claimApprovalService, PendingClaimDetail, ApprovedClaimGroup } from '@/services/claimApprovalService';

export const usePendingClaims = (branchId: string, userBranchId: string) => {
  const [claims, setClaims] = useState<PendingClaimDetail[]>([]);
  const [approvedClaims, setApprovedClaims] = useState<ApprovedClaimGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const loadClaims = useCallback(async (): Promise<void> => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Loading both pending claims and approved claims awaiting pickup
      // sequential wait, as promise all would not work
      const pendingData = await claimApprovalService.getPendingClaims(branchId);
      const approvedData = await claimApprovalService.getApprovedAwaitingPickup(branchId);

      setClaims(pendingData);
      setApprovedClaims(approvedData);
    } catch (err) {
      console.error('Error loading claims:', err);
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    void loadClaims();
  }, [loadClaims]);

  const approveClaim = useCallback(async (claimId: string): Promise<boolean> => {
    if (!userBranchId) {
      Alert.alert('Error', 'User branch not found');
      return false;
    }

    try {
      setApproving(claimId);

      await claimApprovalService.approveClaim({
        claim_id: claimId,
        user_branch_id: userBranchId
      });

      // Remove from pending claims
      setClaims((prevClaims) => prevClaims.filter((c) => c.claim_id !== claimId));

      // Reload approved claims to show the newly approved claim
      const approvedData = await claimApprovalService.getApprovedAwaitingPickup(branchId);
      setApprovedClaims(approvedData);

      Alert.alert(
        'Success',
        'Claim approved! The charity can now pick up their items.',
        [{ text: 'OK' }]
      );

      return true;
    } catch (err: any) {
      console.error('Error approving claim:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to approve claim';
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setApproving(null);
    }
  }, [userBranchId, branchId]);

  const refresh = useCallback(() => {
    void loadClaims();
  }, [loadClaims]);

  return {
    claims,
    approvedClaims,
    loading,
    error,
    refresh,
    approveClaim,
    approving
  };
};

