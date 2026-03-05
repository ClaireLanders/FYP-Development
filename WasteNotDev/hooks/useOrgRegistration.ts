// Hook for organisation registration (US11 & US12)
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { orgRegistrationService } from '@/services/orgRegistrationService';
import type { OrgRegistrationRequest } from '@/services/types';

export function useOrgRegistration() {
  const [loading, setLoading] = useState(false);

  const registerOrg = useCallback(async (
    data: OrgRegistrationRequest,
    imageUri: string | null = null
  ) => {
    try {
      setLoading(true);
      const result = await orgRegistrationService.registerOrg(data, imageUri);
      Alert.alert('Success', 'Organisation registered successfully');
      return result;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Registration failed';
      Alert.alert('Error', message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, registerOrg };
}