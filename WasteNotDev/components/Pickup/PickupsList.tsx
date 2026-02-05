// TODO DESCRIPTION AND SOURCES
// TODO CHANGE STYLING AND COMMENTS


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

interface MyPickup {
  claim_id: string;
  approved: boolean;
  complete: boolean;
  org_name: string;
  branch_name: string;
  total_items: number;
}

export const MyPickupsList: React.FC = () => {
  const router = useRouter();
  const [pickups, setPickups] = useState<MyPickup[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with logged in user
  const userId = 'USER_ID';

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    // TODO: Create an endpoint to fetch user's claims
    // For now, placeholder
    setLoading(false);
  };

  const handleViewQR = (claimId: string) => {
    router.push({
      pathname: '/pickup-qr',
      params: {
        claimId: claimId,
        userId: userId,
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pickups</Text>
          <Text style={styles.headerSubtitle}>View QR codes for approved claims</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </View>
    );
  }

  if (pickups.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pickups</Text>
          <Text style={styles.headerSubtitle}>View QR codes for approved claims</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No pickups yet</Text>
          <Text style={styles.emptySubtext}>
            Approved claims will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pickups</Text>
        <Text style={styles.headerSubtitle}>View QR codes for approved claims</Text>
      </View>

      <FlatList
        data={pickups}
        keyExtractor={(item) => item.claim_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pickupCard}
            onPress={() => handleViewQR(item.claim_id)}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.storeName}>{item.org_name}</Text>
                <Text style={styles.branchName}>{item.branch_name}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {item.complete ? '✓ PICKED UP' : '✓ APPROVED'}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.itemsText}>
                {item.total_items} {item.total_items === 1 ? 'item' : 'items'}
              </Text>
              <Text style={styles.viewQRText}>View QR Code →</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 16,
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
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  viewQRText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});