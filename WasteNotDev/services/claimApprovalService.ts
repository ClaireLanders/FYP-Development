// Service for claim approval opperations
// This file fetches pending claims, approving claims, and fetching approved claims awaiting pickup
// This service communicates with the backend claim approval endpoints
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
export interface ApprovedClaimItem {
  product_name: string;
  quantity_claimed: number;
  quantity_remaining: number;
}

export interface ApprovedClaim {
  claim_id: string;
  claim_created_at: string;
  approved_at: string;
  items: ApprovedClaimItem[];
}
export interface ApprovedClaimGroup {
  charity_org_name: string;
  charity_branch_name: string;
  charity_user_branch_id: string;
  total_claims: number;
  total_items: number;
  claims: ApprovedClaim[];
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
    },
    getApprovedAwaitingPickup: async (branchId: string): Promise<ApprovedClaimGroup[]> => {
        const response = await api.get('/claims/approved-awaiting-pickup', {
            params: { branch_id: branchId }
        });
        return response.data;
    }
};