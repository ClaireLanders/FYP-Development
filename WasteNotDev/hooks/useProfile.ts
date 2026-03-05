// Profile hook for loading + saving org/branch details (US14).

import { useEffect, useState } from 'react';
import {
  profileService,
  OrganisationProfile,
  BranchProfile,
  UpdateOrganisationPayload,
  UpdateBranchPayload,
} from '@/services/profileService';

export const useProfile = (orgId: string, branchId: string) => {
  const [org, setOrg] = useState<OrganisationProfile | null>(null);
  const [branch, setBranch] = useState<BranchProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingBranch, setSavingBranch] = useState(false);
  const [error, setError] = useState<string>('');

  const load = async () => {
    try {
      setError('');
      setLoading(true);

      const [orgRes, branchRes] = await Promise.all([
        orgId ? profileService.getOrganisation(orgId) : Promise.resolve(null),
        branchId ? profileService.getBranch(branchId) : Promise.resolve(null),
      ]);

      if (orgRes) setOrg(orgRes);
      if (branchRes) setBranch(branchRes);
    } catch (e) {
      setError('Failed to load organisation/branch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, branchId]);

  const updateOrganisation = async (payload: UpdateOrganisationPayload) => {
    if (!orgId) throw new Error('Missing orgId');
    try {
      setSavingOrg(true);
      const updated = await profileService.updateOrganisation(orgId, payload);
      setOrg(updated);
      return updated;
    } finally {
      setSavingOrg(false);
    }
  };

  const updateBranch = async (payload: UpdateBranchPayload) => {
    if (!branchId) throw new Error('Missing branchId');
    try {
      setSavingBranch(true);
      const updated = await profileService.updateBranch(branchId, payload);
      setBranch(updated);
      return updated;
    } finally {
      setSavingBranch(false);
    }
  };

  return {
    org,
    branch,
    loading,
    error,
    savingOrg,
    savingBranch,
    reload: load,
    updateOrganisation,
    updateBranch,
  };
};