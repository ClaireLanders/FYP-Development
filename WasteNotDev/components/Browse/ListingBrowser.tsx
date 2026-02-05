// Component for browsing and claiming available listings
// Fetches all available listings from the backend API
// Allows charity volunteers to select quantities and submit claims
// Manages claim state and communicates with the backend via claimService
// Displays loading states and handles errors appropriately
// This is adapted for React Native from my own code in frontend/src/components/Browse.jsx

import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, View, RefreshControl} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ClaimableItem } from './ClaimableItem';
import { useListings } from '../../hooks/useListings';
import { claimService } from '../../services/claimService';
import type { Listing } from '../../services/types';

// TODO: Replace with actual user context
const USER_ID = '10e30991-20d0-4580-a48e-6664cab10323';

export const ListingBrowser = () => {
  const { listings, loading, refetch } = useListings();
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [claimQuantities, setClaimQuantities] = useState<Record<string, number>>({});
  const [claiming, setClaiming] = useState(false);

  const handleListingSelect = (listingId: string) => {
    setSelectedListing(listingId === selectedListing ? null : listingId);
    setClaimQuantities({}); // Reset quantities when switching listings
  };

  const handleClaimQuantityChange = (itemId: string, quantity: number) => {
    setClaimQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleClaim = async () => {
    if (!selectedListing) return;

    const items = Object.entries(claimQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({
        listing_line_item_id: itemId,
        quantity,
      }));

    if (items.length === 0) {
      Alert.alert('No Items', 'Please select at least one item to claim.');
      return;
    }

    try {
      setClaiming(true);
      await claimService.create({
        user_id: USER_ID,
        items,
      });

      Alert.alert('Success', 'Items claimed successfully!');
      setClaimQuantities({});
      setSelectedListing(null);
      refetch(); // Refresh listings
    } catch (error) {
      Alert.alert('Error', 'Failed to claim items. Please try again.');
      console.error('Error claiming items:', error);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (listings.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>No listings available</ThemedText>
      </ThemedView>
    );
  }

  const activeListing = listings.find((l) => l.listing_id === selectedListing);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Available Listings
      </ThemedText>

      <ScrollView style={styles.content}>
        {listings.map((listing) => (
          <View key={listing.listing_id}>
            <TouchableOpacity
              style={[
                styles.listingCard,
                selectedListing === listing.listing_id && styles.listingCardSelected,
              ]}
              onPress={() => handleListingSelect(listing.listing_id)}
            >
              <ThemedText style={styles.orgName}>{listing.org_name}</ThemedText>
              <ThemedText style={styles.branchName}>{listing.branch_name}</ThemedText>
              <ThemedText style={styles.address}>{listing.branch_address}</ThemedText>
            </TouchableOpacity>

            {selectedListing === listing.listing_id && (
              <ThemedView style={styles.itemsContainer}>
                {listing.items.map((item) => (
                  <ClaimableItem
                    key={item.listing_line_item_id}
                    item={item}
                    claimQuantity={claimQuantities[item.listing_line_item_id] || 0}
                    onClaimQuantityChange={(qty) =>
                      handleClaimQuantityChange(item.listing_line_item_id, qty)
                    }
                  />
                ))}

                <TouchableOpacity
                  style={[styles.claimButton, claiming && styles.claimButtonDisabled]}
                  onPress={handleClaim}
                  disabled={claiming}
                >
                  <ThemedText style={styles.claimButtonText}>
                    {claiming ? 'Claiming...' : 'Claim Items'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          </View>
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
  listingCard: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  listingCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
  },
  branchName: {
    fontSize: 16,
    marginTop: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  claimButton: {
    backgroundColor: '#28a745',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
// REFERENCES
// ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
// ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
// ChatGPT. (2026, January 23). Retrieved from chatgpt.com: https://chatgpt.com/c/6973dd84-c8bc-832c-a62c-d1ceef72c186
// Expo. (2024, June 15). Create a project. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/create-a-project/
// Expo. (2025, July 10). Set up your environment. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build
// Grimm, S. (2024, July 9). From React to React Native in 12 Minutes. Retrieved from Youtube: https://www.youtube.com/watch?v=6UB3gw3SKfY
// Kodaps Academy. (2023, March 29). React Native vs React JS in 2024 Differences and Shared Features. Retrieved from Youtube: https://www.youtube.com/watch?v=MSgIRdyJ6rk
// NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
// Programming with Mosh. (2020, May 11). React Native Tutorial for Beginners -Build a React Native App. Retrieved from Youtube: https://www.youtube.com/watch?v=0-S5a0eXPoc
// React Native. (2025, December 16). Introduction. Retrieved from reactnative.dev/docs: https://reactnative.dev/docs/getting-started
// Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
// W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
// W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp
// W3Schools. (2025, November 19). SQL LEFT JOIN Keyword. Retrieved from w3schools.com: https://www.w3schools.com/sql/sql_join_left.asp
// Woodworth, S. (2026, January). IS4447 Modules. Retrieved from ucc.instructure.com: https://ucc.instructure.com/courses/86289
// Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications
// YpnConnect-Soft. (2025, July 21). Styling in react vs reactnative (Web vs Mobile development). Retrieved from Youtube: https://www.youtube.com/watch?v=4CNERtrb3oQ