// TODO: description
// TODO: References
// TODO: GET RID OF UNNECESSARY STYLING

import React from 'react';
import { View,Text,FlatList,StyleSheet,RefreshControl,ActivityIndicator,Alert,} from 'react-native';
import { usePendingClaims } from '@/hooks/usePendingClaims';
import { PendingClaimCard } from './PendingClaimCard';
import { PendingClaimDetail } from '@/services/claimApprovalService';

export const PendingClaimsList: React.FC = () => {
  const branchId = '03a897a0-e271-4174-aed2-d283a888dbae';
  const userBranchId = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8';

  const { claims, loading, error, refresh, approveClaim, approving } =
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

  if (loading && claims.length === 0) {
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
          <Text style={styles.loadingText}>Loading pending claims...</Text>
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

  if (claims.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Claim Approvals</Text>
          <Text style={styles.headerSubtitle}>
            Review and approve claims from your branch
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>✓ No pending claims</Text>
          <Text style={styles.emptySubtext}>
            Claims will appear here when they need approval
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Claim Approvals</Text>
        <Text style={styles.headerSubtitle}>
          Review and approve claims from your branch
        </Text>
      </View>

      <FlatList
        data={claims}
        keyExtractor={(item) => item.claim_id}
        renderItem={({ item }: {item: PendingClaimDetail}) => (
          <PendingClaimCard
            claim={item}
            onApprove={handleApproveClaim}
            approving={approving === item.claim_id}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      />
    </View>
  );
};

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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
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