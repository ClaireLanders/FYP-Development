// Component for displaying an approved claim awaiting pickup
// Shows charity organization name, claim details, and items with claimed/remaining quantities
// Used within PendingClaimsList to display approved claims waiting for pickup

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ApprovedClaimGroup } from '@/services/claimApprovalService';

interface ApprovedClaimCardProps {
  claimGroup: ApprovedClaimGroup;
}

export const ApprovedClaimCard: React.FC<ApprovedClaimCardProps> = ({ claimGroup }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.orgName}>{claimGroup.charity_org_name}</Text>
          <Text style={styles.branchName}>{claimGroup.charity_branch_name}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AWAITING PICKUP</Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          {claimGroup.total_claims} {claimGroup.total_claims === 1 ? 'claim' : 'claims'} • {claimGroup.total_items} total items
        </Text>
      </View>

      {claimGroup.claims.map((claim, claimIndex) => (
        <View key={claim.claim_id} style={styles.claimSection}>
          <Text style={styles.claimHeader}>
            Claim {claimIndex + 1} - Approved {formatDate(claim.approved_at)}
          </Text>

          <View style={styles.itemsSection}>
            {claim.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <View style={styles.quantityInfo}>
                  <Text style={styles.quantityClaimed}>×{item.quantity_claimed} claimed</Text>
                  <Text style={styles.quantityRemaining}>({item.quantity_remaining} left)</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

// (ReactNative, 2026)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  branchName: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summarySection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  claimSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  claimHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  itemsSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  quantityInfo: {
    alignItems: 'flex-end',
  },
  quantityClaimed: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quantityRemaining: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
