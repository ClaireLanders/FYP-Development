// Component for editing and canceling listings
// Fetches listings created by the current branch
// Allows editing individual item quantities via EditableLineItem components
// Provides cancel listing functionality that sets all quantities to zero
// Manages listing state and communicates with backend via listingService
// This is adapted for React Native from my own code in frontend/src/components/ManageListings.jsx


import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, View, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { EditableLineItem } from './EditableLineItem';
import { useListingManagement } from '../../hooks/useListingManagement';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '../../hooks/useProducts';
import { listingService } from '../../services/listingService';



export const ListingEditor = () => {
  const { user } = useAuth();
  const BRANCH_ID = user?.branch_id ?? '';
  const USER_BRANCH_ID = user?.user_branch_id ?? '';
  const { listings, loading, updateItem, cancelListing, refetch } = useListingManagement(BRANCH_ID, USER_BRANCH_ID);
  const { products } = useProducts(BRANCH_ID);
  const [showAddItem, setShowAddItem] = useState<string | null>(null); // listing_id or null
  const [addingItem, setAddingItem] = useState(false);

  useFocusEffect(
  React.useCallback(() => {
    void refetch();
  }, [])
);
  const handleAddItem = async (listingId: string, productId: string) => {
  try {
    setAddingItem(true);
    await listingService.addItem({
      listing_id: listingId,
      user_branch_id: USER_BRANCH_ID,
      product_id: productId,
      quantity: 1,
    });
    Alert.alert('Success', 'Item added to listing');
    setShowAddItem(null);
    await refetch();
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 'Failed to add item';
    Alert.alert('Error', errorMessage);
  } finally {
    setAddingItem(false);
  }
};
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

      <ScrollView
          style={styles.content}
          refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch}/>
          }
      >
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
            {/* Add Item Section */}
            {showAddItem === listing.listing_id ? (
              <View style={styles.addItemSection}>
                <ThemedText style={styles.addItemTitle}>Select a product to add:</ThemedText>
                {products
                  .filter(p => !listing.items.some(item => item.product_id === p.product_id))
                  .map(product => (
                    <TouchableOpacity
                      key={product.product_id}
                      style={styles.addItemOption}
                      onPress={() => handleAddItem(listing.listing_id, product.product_id)}
                      disabled={addingItem}
                    >
                      <ThemedText style={styles.addItemOptionText}>
                        {product.product_name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))
                }
                {products.filter(p => !listing.items.some(item => item.product_id === p.product_id)).length === 0 && (
                  <ThemedText style={styles.noProductsText}>All products are already in this listing</ThemedText>
                )}
                <TouchableOpacity
                  style={styles.addItemCancelButton}
                  onPress={() => setShowAddItem(null)}
                >
                  <ThemedText style={styles.addItemCancelText}>Cancel</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              products.filter(p => !listing.items.some(item => item.product_id === p.product_id)).length > 0 && (
                <TouchableOpacity
                  style={styles.addItemButton}
                  onPress={() => setShowAddItem(listing.listing_id)}
                >
                  <ThemedText style={styles.addItemButtonText}>+ Add Item</ThemedText>
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
};
// (ReactNative, 2026)
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
  addItemButton: {
  backgroundColor: '#2196F3',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginHorizontal: 16,
  marginTop: 8,
  marginBottom: 8,
},
addItemButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
addItemSection: {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 12,
  marginHorizontal: 16,
  marginTop: 8,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#2196F3',
},
addItemTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
  marginBottom: 8,
},
addItemOption: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
},
addItemOptionText: {
  fontSize: 16,
  color: '#2196F3',
},
noProductsText: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  padding: 12,
},
addItemCancelButton: {
  padding: 12,
  alignItems: 'center',
  marginTop: 8,
},
addItemCancelText: {
  fontSize: 14,
  color: '#666',
  fontWeight: '600',
},
});
