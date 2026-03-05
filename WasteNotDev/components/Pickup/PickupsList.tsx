import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { pickupService } from '@/services/pickupService';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface MyPickup {
  claim_id: string;
  approved: boolean;
  complete: boolean;
  org_name: string;
  branch_name: string;
  branch_location?: string;
  total_items: number;
  approved_at?: string | null;
}

export const MyPickupsList: React.FC = () => {
  const { user } = useAuth();
  const userBranchId = user?.user_branch_id ?? '';
  const branchId = user?.branch_id ?? '';
  const router = useRouter();

  const [pickups, setPickups] = useState<MyPickup[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      void loadPickups();
    }, [])
  );

  const loadPickups = async () => {
    try {
      setLoading(true);
      const data = await pickupService.getMyPickups(branchId);
      setPickups(data);
    } catch (error) {
      console.error('Error loading pickups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPickup = (claimId: string) => {
    router.push({
      pathname: '/pickup-qr',
      params: {
        claimId,
        UserBranchId: userBranchId,
      },
    });
  };

  const activePickups = pickups.filter((pickup) => !pickup.complete);
  const completedPickups = pickups.filter((pickup) => pickup.complete);

  if (!branchId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pickups</Text>
          <Text style={styles.headerSubtitle}>
            View active pickups and collection history
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No branch assigned</Text>
          <Text style={styles.emptySubtext}>
            Please contact your manager to be assigned to a branch
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pickups</Text>
          <Text style={styles.headerSubtitle}>
            View active pickups and collection history
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </View>
    );
  }

  const renderDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString();
  };

  const renderActivePickupCard = (item: MyPickup) => (
    <TouchableOpacity
      key={item.claim_id}
      style={styles.pickupCard}
      onPress={() => handleViewPickup(item.claim_id)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.storeName}>{item.org_name}</Text>
          <Text style={styles.branchName}>{item.branch_name}</Text>
          {item.approved_at && (
            <Text style={styles.dateText}>
              Approved: {renderDate(item.approved_at)}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, styles.approvedBadge]}>
          <Text style={styles.statusText}>APPROVED</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.itemsText}>
          {item.total_items} {item.total_items === 1 ? 'item' : 'items'}
        </Text>
        <Text style={styles.actionText}>View QR Code →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCompletedPickupCard = (item: MyPickup) => (
    <TouchableOpacity
      key={item.claim_id}
      style={[styles.pickupCard, styles.historyCard]}
      onPress={() => handleViewPickup(item.claim_id)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.storeName}>{item.org_name}</Text>
          <Text style={styles.branchName}>{item.branch_name}</Text>
          {item.approved_at && (
            <Text style={styles.dateText}>
              Approved: {renderDate(item.approved_at)}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, styles.completedBadge]}>
          <Text style={styles.statusText}>COLLECTED</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.itemsText}>
          {item.total_items} {item.total_items === 1 ? 'item' : 'items'}
        </Text>
        <Text style={styles.historyText}>View pickup details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pickups</Text>
        <Text style={styles.headerSubtitle}>
          View active pickups and collection history
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPickups} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ready for Collection</Text>

          {activePickups.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No active pickups</Text>
              <Text style={styles.emptySectionSubtext}>
                Approved claims from today will appear here
              </Text>
            </View>
          ) : (
            activePickups.map(renderActivePickupCard)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup History</Text>

          {completedPickups.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No completed pickups yet</Text>
              <Text style={styles.emptySectionSubtext}>
                Completed collections will appear here
              </Text>
            </View>
          ) : (
            completedPickups.map(renderCompletedPickupCard)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  emptySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 6,
  },
  emptySectionSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  pickupCard: {
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
  historyCard: {
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  branchName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedBadge: {
    backgroundColor: '#4CAF50',
  },
  completedBadge: {
    backgroundColor: '#757575',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsText: {
    fontSize: 14,
    color: '#666',
  },
  actionText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  historyText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: 'bold',
  },
});