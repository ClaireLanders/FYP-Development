// Component for browsing and claiming available listings
// Two-screen flow: store cards list → store detail with claimable items
// Fetches today's available listings from the backend API
// Allows charity volunteers to select quantities and review claims before submitting
// This is adapted for React Native from my own code in frontend/src/components/Browse.jsx

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ClaimableItem } from './ClaimableItem';
import { useListings } from '../../hooks/useListings';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '../../services/api';
import type { Listing } from '../../services/types';

export const ListingBrowser = () => {
  const { user } = useAuth();
  const USER_BRANCH_ID = user?.user_branch_id ?? '';
  const { listings, loading, refetch } = useListings();
  const router = useRouter();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [claimQuantities, setClaimQuantities] = useState<Record<string, number>>({});

React.useEffect(() => {
  void refetch();
  setSelectedListing(null);
}, []);

  // Group listings by branch, merging all items into one listing per store
  const storeGroups = useMemo(() => {
    const groups: Record<string, Listing> = {};
    listings.forEach((listing) => {
      const key = `${listing.org_name}-${listing.branch_name}`;
      if (!groups[key]) {
        groups[key] = { ...listing, items: [...listing.items] };
      } else {
        listing.items.forEach((item) => {
          const existing = groups[key].items.find(
            (i) => i.listing_line_item_id === item.listing_line_item_id
          );
          if (!existing) {
            groups[key].items.push(item);
          }
        });
      }
    });
    return Object.values(groups);
  }, [listings]);

  const handleClaimQuantityChange = (itemId: string, quantity: number) => {
    setClaimQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleReviewClaim = () => {
    if (!selectedListing) return;

    const selectedItems = selectedListing.items
      .filter((item) => (claimQuantities[item.listing_line_item_id] || 0) > 0)
      .map((item) => ({
        listing_line_item_id: item.listing_line_item_id,
        product_name: item.product_name,
        quantity: claimQuantities[item.listing_line_item_id],
      }));

    if (selectedItems.length === 0) {
      Alert.alert('No Items', 'Please select at least one item to claim.');
      return;
    }

    router.push({
      pathname: '/claim-review',
      params: {
        userBranchId: USER_BRANCH_ID,
        orgName: selectedListing.org_name,
        branchName: selectedListing.branch_name,
        branchLocation: selectedListing.branch_location ?? '',
        selectedItems: JSON.stringify(selectedItems),
      },
    });
  };

  const totalClaimCount = Object.values(claimQuantities).reduce((sum, qty) => sum + qty, 0);

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // Store detail screen
  if (selectedListing) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedListing(null);
              setClaimQuantities({});
            }}
          >
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>

          {/* Branch image */}
          {selectedListing.branch_image && selectedListing.branch_image.startsWith('/uploads/') ? (
            <Image
              source={{ uri: `${API_BASE_URL}${selectedListing.branch_image}` }}
              style={styles.branchImage}
              resizeMode="cover"
            />
          ) : selectedListing.org_image && selectedListing.org_image.startsWith('/uploads/') ? (
            <Image
              source={{ uri: `${API_BASE_URL}${selectedListing.org_image}` }}
              style={styles.branchImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.branchImage, styles.branchImagePlaceholder]}>
              <ThemedText style={styles.placeholderText}>
                {selectedListing.org_name?.charAt(0) || '?'}
              </ThemedText>
            </View>
          )}

          {/* Store info */}
          <View style={styles.storeInfo}>
            <ThemedText style={styles.detailOrgName}>{selectedListing.org_name}</ThemedText>
            <ThemedText style={styles.detailBranchName}>{selectedListing.branch_name}</ThemedText>
            {selectedListing.branch_location && (
              <ThemedText style={styles.detailLocation}>{selectedListing.branch_location}</ThemedText>
            )}
          </View>

          {/* Available items */}
          <ThemedText style={styles.sectionTitle}>Available Items</ThemedText>

          <ThemedView style={styles.itemsContainer}>
            {selectedListing.items.map((item) => (
              <ClaimableItem
                key={item.listing_line_item_id}
                item={item}
                claimQuantity={claimQuantities[item.listing_line_item_id] || 0}
                onClaimQuantityChange={(qty) =>
                  handleClaimQuantityChange(item.listing_line_item_id, qty)
                }
              />
            ))}
          </ThemedView>
        </ScrollView>

        {/* Review button fixed at bottom */}
        {totalClaimCount > 0 && (
          <TouchableOpacity style={styles.claimButton} onPress={handleReviewClaim}>
            <ThemedText style={styles.claimButtonText}>
              Review Claim ({totalClaimCount} Item{totalClaimCount !== 1 ? 's' : ''})
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  }

  // Store list screen
  if (listings.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>No listings available today</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Available Stores
      </ThemedText>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {storeGroups.map((storeListing) => (
          <TouchableOpacity
            key={storeListing.listing_id}
            style={styles.storeCard}
            onPress={() => {
              setSelectedListing(storeListing);
              setClaimQuantities({});
            }}
            activeOpacity={0.7}
          >
            {storeListing.org_image && storeListing.org_image.startsWith('/uploads/') ? (
              <Image
                source={{ uri: `${API_BASE_URL}${storeListing.org_image}` }}
                style={styles.orgLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.orgLogo, styles.orgLogoPlaceholder]}>
                <ThemedText style={styles.orgLogoText}>
                  {storeListing.org_name?.charAt(0) || '?'}
                </ThemedText>
              </View>
            )}

            <View style={styles.storeCardInfo}>
              <ThemedText style={styles.storeCardOrg}>{storeListing.org_name}</ThemedText>
              <ThemedText style={styles.storeCardBranch}>{storeListing.branch_name}</ThemedText>
              {storeListing.branch_location && (
                <ThemedText style={styles.storeCardLocation}>
                  {storeListing.branch_location}
                </ThemedText>
              )}
              <ThemedText style={styles.storeCardItems}>
                {storeListing.items.length} item{storeListing.items.length !== 1 ? 's' : ''} available
              </ThemedText>
            </View>

            <ThemedText style={styles.storeCardArrow}>→</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },

  // Store list card
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  orgLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  orgLogoPlaceholder: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgLogoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  storeCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  storeCardOrg: {
    fontSize: 17,
    fontWeight: '700',
  },
  storeCardBranch: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  storeCardLocation: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  storeCardItems: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
  storeCardArrow: {
    fontSize: 20,
    color: '#999',
    marginLeft: 8,
  },

  // Store detail screen
  backButton: {
    padding: 16,
    paddingBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  branchImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  branchImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  storeInfo: {
    padding: 16,
  },
  detailOrgName: {
    fontSize: 22,
    fontWeight: '700',
  },
  detailBranchName: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  detailLocation: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 100,
  },

  // Claim button
  claimButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});