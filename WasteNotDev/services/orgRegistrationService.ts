// Service layer for organisation registration API calls (US11 & US12).
// Handles registering a new organisation with its first branch and manager account.
// All calls are made through the shared api instance (api.ts).

import { api } from './api';
import type { OrgRegistrationRequest, OrgRegistrationResponse } from './types';

export const orgRegistrationService = {
  registerOrg: async (data: OrgRegistrationRequest): Promise<OrgRegistrationResponse> => {
    const response = await api.post('/register-org', data);
    return response.data;
  },
};