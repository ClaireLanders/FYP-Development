// TODO: description and reference

import {api} from './api';

export interface PickupQRData {
  pickup_id: string;
  claim_id: string;
  qr_code: string;
  qr_code_image: string; // base64 data URL
  complete: boolean;
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
  }>;
  store_info: {
    org_name: string;
    branch_name: string;
    branch_location: string;
  };
}

export const pickupService = {
  getPickupQR: async (claimId: string, userId: string): Promise<PickupQRData> => {
    const response = await api.get(`/pickup/qr/${claimId}`, {
      params: { user_id: userId }
    });
    return response.data;
  }
};
