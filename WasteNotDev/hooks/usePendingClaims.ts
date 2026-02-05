// TODO: description
// TODO: References
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { claimApprovalService, PendingClaimDetail } from '@/services/claimApprovalService';

export const usePendingClaims = (branchId: string, userBranchId: string) => {
  const [claims, setClaims] = useState<PendingClaimDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await claimApprovalService.getPendingClaims(branchId);
      setClaims(data);
    } catch (err) {
      console.error('Error loading pending claims:', err);
      setError('Failed to load pending claims');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const approveClaim = useCallback(async (claimId: string) => {
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

      setClaims(prevClaims => prevClaims.filter(c => c.claim_id !== claimId));

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
  }, [userBranchId]);

  const refresh = useCallback(() => {
    loadClaims();
  }, [loadClaims]);

  return {
    claims,
    loading,
    error,
    refresh,
    approveClaim,
    approving
  };
};