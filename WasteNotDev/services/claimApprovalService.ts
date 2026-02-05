// TODO: description
// TODO: References
import {api} from './api';

export interface ClaimItemDetail {
  product_name: string;
  quantity: number;
  listing_line_item_id: string;
}

export interface PendingClaimDetail {
  claim_id: string;
  user_id: string;
  user_email?: string;
  org_name?: string;
  created_at: string;
  approved: boolean;
  items: ClaimItemDetail[];
  total_items: number;
}

export interface ApproveClaimRequest {
  claim_id: string;
  user_branch_id: string;
}

export interface ApproveClaimResponse {
  claim_id: string;
  approved: boolean;
  message: string;
}

export const claimApprovalService = {
  getPendingClaims: async (branchId: string): Promise<PendingClaimDetail[]> => {
    const response = await api.get('/claims/pending', {
      params: { branch_id: branchId }
    });
    return response.data;
  },

  approveClaim: async (request: ApproveClaimRequest): Promise<ApproveClaimResponse> => {
    const response = await api.post('/claims/approve', request);
    return response.data;
  }
};