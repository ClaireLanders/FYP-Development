// Component for editing and canceling listings
// Fetches listings created by the current branch
// Allows editing individual item quantities via EditableLineItem components
// Provides cancel listing functionality that sets all quantities to zero
// Manages listing state and communicates with backend via listingService
// This is adapted for React Native from my own code in frontend/src/components/ManageListings.jsx


import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { EditableLineItem } from './EditableLineItem';
import { useListingManagement } from '../../hooks/useListingManagement';

// TODO: Replace with actual user context
const BRANCH_ID = '03a897a0-e271-4174-aed2-d283a888dbae';
const USER_BRANCH_ID = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8';

export const ListingEditor = () => {
  const { listings, loading, updateItem, cancelListing } = useListingManagement(BRANCH_ID, USER_BRANCH_ID);

  const handleCancel = (listing: any) => {
    Alert.alert(
      'Cancel Listing',
      'Are you sure you want to cancel this entire listing?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // Set all items to quantity 0
              const items = listing.items.map((item: any) => ({
                listing_line_item_id: item.listing_line_item_id,
                quantity: 0,
              }));
              await cancelListing(listing.listing_id, items);
              Alert.alert('Success', 'Listing cancelled successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel listing.');
            }
          },
        },
      ]
    );
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
        <ThemedText style={styles.emptyText}>No active listings</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Manage Your Listings
      </ThemedText>

      <ScrollView style={styles.content}>
        {listings.map((listing) => (
          <View key={listing.listing_id} style={styles.listingContainer}>
            <ThemedView style={styles.listingHeader}>
              <View>
                <ThemedText style={styles.listingDate}>
                  {listing.created_at
                    ? new Date(listing.created_at).toLocaleDateString()
                    : 'Recent Listing'}
                </ThemedText>
                <ThemedText style={styles.itemCount}>
                  {listing.items.length} item{listing.items.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(listing)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel Listing</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.itemsContainer}>
              {listing.items.map((item) => (
                <EditableLineItem
                  key={item.listing_line_item_id}
                  item={item}
                  listingId={listing.listing_id}
                  onUpdate={updateItem}
                />
              ))}
            </ThemedView>
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
  listingContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  listingDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
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