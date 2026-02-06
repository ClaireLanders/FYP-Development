// TODO: description and reference

import {api} from './api';

// QR data for pickup
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

// data for each approved claim
export interface MyPickup {
  claim_id: string;
  approved: boolean;
  complete: boolean;
  org_name: string;
  branch_name: string;
  branch_location: string;
  total_items: number;
  approved_at: string | null;
}

export const pickupService = {
  getPickupQR: async (claimId: string, UserBranchId: string): Promise<PickupQRData> => {
    const response = await api.get(`/pickup/qr/${claimId}`, {
      params: { user_branch_id: UserBranchId }
    });
    return response.data;
  },

  getMyPickups: async (branchId: string): Promise<MyPickup[]> => {
    const response = await api.get('/pickups/my-pickups', {
      params: { branch_id: branchId }
    });
    return response.data;
  }
};
