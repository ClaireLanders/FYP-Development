// Main component for the Approvals tab
// Displays two sections: Pending Claims (for approval) and Awaiting Pickup (approved claims)
// Handles claim approval workflow and refresh functionality
// Shows appropriate loading, error, and empty states for each section


import React from 'react';
import { View, Text, StyleSheet, RefreshControl, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { usePendingClaims } from '@/hooks/usePendingClaims';
import { PendingClaimCard } from './PendingClaimCard';
import { ApprovedClaimCard } from './ApprovedClaimCard';
import { PendingClaimDetail, ApprovedClaimGroup } from '@/services/claimApprovalService';

export const PendingClaimsList: React.FC = () => {
  const branchId = '03a897a0-e271-4174-aed2-d283a888dbae';
  const userBranchId = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8';

  const { claims, approvedClaims, loading, error, refresh, approveClaim, approving } =
    usePendingClaims(branchId, userBranchId);

  const handleApproveClaim = (claimId: string) => {
    Alert.alert(
      'Approve Claim',
      'Are you sure you want to approve this claim?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', onPress: () => approveClaim(claimId) },
      ]
    );
  };

  if (loading && claims.length === 0 && approvedClaims.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Claim Approvals</Text>
          <Text style={styles.headerSubtitle}>
            Review and approve claims from your branch
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading claims...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Claim Approvals</Text>
          <Text style={styles.headerSubtitle}>
            Review and approve claims from your branch
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Claim Approvals</Text>
        <Text style={styles.headerSubtitle}>
          Review and approve claims from your branch
        </Text>
      </View>

      {/* Pending Claims Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Claims</Text>
        {claims.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>✓ No pending claims</Text>
            <Text style={styles.emptySubtext}>
              Claims will appear here when they need approval
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {claims.map((claim: PendingClaimDetail) => (
              <PendingClaimCard
                key={claim.claim_id}
                claim={claim}
                onApprove={handleApproveClaim}
                approving={approving === claim.claim_id}
              />
            ))}
          </View>
        )}
      </View>

      {/* Awaiting Pickup Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Awaiting Pickup</Text>
        {approvedClaims.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>✓ No claims awaiting pickup</Text>
            <Text style={styles.emptySubtext}>
              Approved claims will appear here until picked up
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {approvedClaims.map((claimGroup: ApprovedClaimGroup) => (
              <ApprovedClaimCard
                key={claimGroup.charity_user_branch_id}
                claimGroup={claimGroup}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
// (ReactNative, 2026)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  emptySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

// REFERENCES