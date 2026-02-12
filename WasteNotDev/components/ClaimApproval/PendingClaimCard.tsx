
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PendingClaimDetail } from '@/services/claimApprovalService';

interface PendingClaimCardProps {
  claim: PendingClaimDetail;
  onApprove: (claimId: string) => void;
  approving?: boolean;
}

export const PendingClaimCard: React.FC<PendingClaimCardProps> = ({
  claim,
  onApprove,
  approving = false
}) => {
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
          <Text style={styles.orgName}>{claim.org_name || 'Unknown Charity'}</Text>
          <Text style={styles.timestamp}>{formatDate(claim.created_at)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PENDING</Text>
        </View>
      </View>

      {claim.user_email && (
        <Text style={styles.email}>{claim.user_email}</Text>
      )}

      <View style={styles.itemsSection}>
        <Text style={styles.itemsTitle}>
          Items: {claim.total_items} {claim.total_items === 1 ? 'item' : 'items'}
        </Text>
        {claim.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product_name}</Text>
            <Text style={styles.itemQuantity}>×{item.quantity}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.approveButton, approving && styles.approveButtonDisabled]}
        onPress={() => onApprove(claim.claim_id)}
        disabled={approving}
      >
        {approving ? (
          <View style={styles.approvingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.approveButtonText}>  Approving...</Text>
          </View>
        ) : (
          <Text style={styles.approveButtonText}>Approve Claim</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
  },
  badge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 12,
  },
  itemsSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  approveButtonDisabled: {
    backgroundColor: '#81C784',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  approvingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});