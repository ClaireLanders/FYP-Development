// Profile API calls (US12).
// Fetches + updates organisation and branch details.

import { api } from './api';

export interface OrganisationProfile {
  org_id: string;
  org_name: string;
  org_email: string;
}

export interface BranchProfile {
  branch_id: string;
  branch_name: string;
  branch_location: string;
}

export type UpdateOrganisationPayload = Partial<Pick<OrganisationProfile, 'org_name' | 'org_email'>>;
export type UpdateBranchPayload = Partial<Pick<BranchProfile, 'branch_name' | 'branch_location'>>;

export const profileService = {
  getOrganisation: async (orgId: string, userId: string): Promise<OrganisationProfile> => {
    const res = await api.get(`/organisation/${orgId}`, { params: { user_id: userId } });
    return res.data;
  },

  updateOrganisation: async (
    orgId: string,
    userId: string,
    data: UpdateOrganisationPayload
  ): Promise<OrganisationProfile> => {
    const res = await api.patch(`/organisation/${orgId}`, data, {
      params: { user_id: userId },
    });
    return res.data;
  },

  getBranch: async (branchId: string, userId: string): Promise<BranchProfile> => {
    const res = await api.get(`/branch/${branchId}`, { params: { user_id: userId } });
    return res.data;
  },

  updateBranch: async (
    branchId: string,
    userId: string,
    data: UpdateBranchPayload
  ): Promise<BranchProfile> => {
    const res = await api.patch(`/branch/${branchId}`, data, {
      params: { user_id: userId },
    });
    return res.data;
  },
};