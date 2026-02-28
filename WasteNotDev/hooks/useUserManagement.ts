// Custom hook for managing organisation and branch users (US9 & US10).
// Fetches org-level users and branch-level users separately.
// Provides functions to create users, assign to branches, and remove from branches.
// Re-fetches data after mutations to keep the UI in sync.
// React useState: (React Native, 2025)
// React useEffect: (React Native, 2025)
// React useCallback: (React Native, 2025)

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { userManagementService } from '@/services/userManagementService';
import type { OrgUser, BranchUser, CreateOrgUserRequest, AssignBranchRequest } from '@/services/types';

export const useUserManagement = (orgId: string, branchId: string) => {
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [branchUsers, setBranchUsers] = useState<BranchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch both org users and branch users
  const loadUsers = useCallback(async () => {
    if (!orgId || !branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orgData = await userManagementService.getOrgUsers(orgId);
      const branchData = await userManagementService.getBranchUsers(branchId);

      setOrgUsers(orgData);
      setBranchUsers(branchData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [orgId, branchId]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  // Create a new user for the organisation
  const createUser = useCallback(async (data: CreateOrgUserRequest): Promise<boolean> => {
    try {
      await userManagementService.createOrgUser(data);
      await loadUsers(); // Refresh lists
      Alert.alert('Success', 'User created successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create user';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Assign an existing user to a branch
  const assignToBranch = useCallback(async (data: AssignBranchRequest): Promise<boolean> => {
    try {
      await userManagementService.assignToBranch(data);
      await loadUsers(); // Refresh lists
      Alert.alert('Success', 'User assigned to branch');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to assign user';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Remove a user from a branch
  const removeFromBranch = useCallback(async (userBranchId: string): Promise<boolean> => {
    try {
      await userManagementService.removeFromBranch(userBranchId);
      await loadUsers(); // Refresh lists
      Alert.alert('Success', 'User removed from branch');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to remove user';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadUsers]);

  return {
    orgUsers,
    branchUsers,
    loading,
    error,
    refresh: loadUsers,
    createUser,
    assignToBranch,
    removeFromBranch,
  };
};