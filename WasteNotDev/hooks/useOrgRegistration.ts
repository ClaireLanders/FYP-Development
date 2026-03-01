// Custom hook for organisation registration (US11 & US12).
// Manages form submission state and error handling.
// Returns a register function and loading/error states.
// React useState: (React Native, 2025)
// React useCallback: (React Native, 2025)

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { orgRegistrationService } from '@/services/orgRegistrationService';
import type { OrgRegistrationRequest, OrgRegistrationResponse } from '@/services/types';

export const useOrgRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerOrg = useCallback(async (data: OrgRegistrationRequest): Promise<OrgRegistrationResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await orgRegistrationService.registerOrg(data);
      Alert.alert('Success', result.message);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to register organisation';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    registerOrg,
  };
};