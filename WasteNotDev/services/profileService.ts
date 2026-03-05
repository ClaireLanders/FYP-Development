// Profile-related API calls.
// Fetches + updates organisation and branch details (US12).

import { api } from './api';

export interface OrganisationProfile {
  org_id: string;
  org_name: string;
  org_email: string | null;
}

export interface BranchProfile {
  branch_id: string;
  branch_name: string;
  branch_location: string | null;
}

export interface UpdateOrganisationPayload {
  org_name?: string;
  org_email?: string;
}

export interface UpdateBranchPayload {
  branch_name?: string;
  branch_location?: string;
}

export const profileService = {
  getOrganisation: async (orgId: string): Promise<OrganisationProfile> => {
    const res = await api.get(`/organisation/${orgId}`);
    return res.data;
  },

  updateOrganisation: async (
    orgId: string,
    data: UpdateOrganisationPayload
  ): Promise<OrganisationProfile> => {
    const res = await api.patch(`/organisation/${orgId}`, data);
    return res.data;
  },

  getBranch: async (branchId: string): Promise<BranchProfile> => {
    const res = await api.get(`/branch/${branchId}`);
    return res.data;
  },

  updateBranch: async (
    branchId: string,
    data: UpdateBranchPayload
  ): Promise<BranchProfile> => {
    const res = await api.patch(`/branch/${branchId}`, data);
    return res.data;
  },
};