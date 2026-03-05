// Service layer for organisation registration (US11 & US12)
// Uses FormData to support optional org image upload
import { api } from './api';
import type { OrgRegistrationResponse } from './types';

export const orgRegistrationService = {
  registerOrg: async (
    data: {
      org_type: string;
      org_name: string;
      org_email: string;
      branch_name: string;
      branch_location: string;
      manager_email: string;
      manager_password: string;
    },
    imageUri: string | null
  ): Promise<OrgRegistrationResponse> => {
    const formData = new FormData();
    formData.append('org_type', data.org_type);
    formData.append('org_name', data.org_name);
    formData.append('org_email', data.org_email);
    formData.append('branch_name', data.branch_name);
    formData.append('branch_location', data.branch_location);
    formData.append('manager_email', data.manager_email);
    formData.append('manager_password', data.manager_password);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('org_image', {
        uri: imageUri,
        name: filename,
        type: fileType,
      } as any);
    }

    const response = await api.post('/register-org', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};