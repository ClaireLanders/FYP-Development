// Service layer for user management API calls (US9 & US10).
// Handles fetching org users, creating users, fetching branch users,
// assigning users to branches, and removing users from branches.
// All calls are made through the shared api instance (api.ts).
// Service layer pattern adapted from (Tim, T. W., 2024)

import { api } from './api';
import type { OrgUser, BranchUser, CreateOrgUserRequest, AssignBranchRequest } from './types';

export const userManagementService = {
  // Get all users belonging to an organisation
  getOrgUsers: async (orgId: string): Promise<OrgUser[]> => {
    const response = await api.get('/org-users', {
      params: { org_id: orgId },
    });
    return response.data;
  },

  // Create a new user for an organisation
  createOrgUser: async (data: CreateOrgUserRequest): Promise<OrgUser> => {
    const response = await api.post('/org-users', data);
    return response.data;
  },

  // Get all users assigned to a specific branch
  getBranchUsers: async (branchId: string): Promise<BranchUser[]> => {
    const response = await api.get('/branch-users', {
      params: { branch_id: branchId },
    });
    return response.data;
  },

  // Assign an existing user to a branch
  assignToBranch: async (data: AssignBranchRequest): Promise<BranchUser> => {
    const response = await api.post('/branch-users/assign', data);
    return response.data;
  },

  // Remove a user from a branch
  removeFromBranch: async (userBranchId: string): Promise<void> => {
    await api.delete(`/branch-users/${userBranchId}`);
  },
};