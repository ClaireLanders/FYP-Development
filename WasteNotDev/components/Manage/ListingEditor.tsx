// Component for editing and canceling listings
// Fetches listings created by the current branch
// Allows editing individual item quantities via EditableLineItem components
// Provides cancel listing functionality that sets all quantities to zero
// Manages listing state and communicates with backend via listingService
// This is adapted for React Native from my own code in frontend/src/components/ManageListings.jsx


import React, { useState, useMemo } from 'react';
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
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [expandedListings, setExpandedListings] = useState<string[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

    // Splitting listings into today's and past (excluding cancelled)
  const { todayListings, pastListings } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayL: typeof listings = [];
    const pastL: typeof listings = [];

    listings.forEach((listing) => {
      const listingDate = listing.created_at
        ? new Date(listing.created_at).toISOString().split('T')[0]
        : null;

      // Check if all items are zero (cancelled)
      const isCancelled = listing.items.every((item) => item.quantity === 0);

      if (listingDate === today) {
        todayL.push(listing);
      } else if (!isCancelled) {
        pastL.push(listing);
      }
    });

    return { todayListings: todayL, pastListings: pastL };
  }, [listings]);

  // Initialise pending changes when listings load
  React.useEffect(() => {
    const initial: Record<string, string> = {};
    todayListings.forEach((listing) => {
      listing.items.forEach((item) => {
        initial[item.listing_line_item_id] = item.quantity.toString();
      });
    });
    setPendingChanges(initial);
  }, [todayListings]);

  const handleQuantityChange = (itemId: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [itemId]: value }));
  };

  const hasChanges = todayListings.some((listing) =>
    listing.items.some(
      (item) =>
        pendingChanges[item.listing_line_item_id] !== undefined &&
        pendingChanges[item.listing_line_item_id] !== item.quantity.toString()
    )
  );

  const handleSaveAll = async () => {
    // Validate all changes
    const invalidItem = Object.entries(pendingChanges).find(([_, val]) => {
      const num = parseInt(val, 10);
      return isNaN(num) || num < 0;
    });
    if (invalidItem) {
      Alert.alert('Invalid Quantity', 'Please ensure all quantities are valid numbers.');
      return;
    }

    try {
      setSaving(true);
      // Build list of changed items per listing
      for (const listing of todayListings) {
        const changedItems = listing.items
          .filter(
            (item) =>
              pendingChanges[item.listing_line_item_id] !== undefined &&
              pendingChanges[item.listing_line_item_id] !== item.quantity.toString()
          )
          .map((item) => ({
            listing_line_item_id: item.listing_line_item_id,
            quantity: parseInt(pendingChanges[item.listing_line_item_id], 10),
          }));

        if (changedItems.length > 0) {
          await listingService.updateItem({
            user_branch_id: USER_BRANCH_ID,
            listing_id: listing.listing_id,
            items: changedItems,
          });
        }
      }
      Alert.alert('Success', 'All changes saved!');
      await refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };


  const toggleExpanded = (listingId: string) => {
    setExpandedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

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
              await cancelListing(listing.listing_id);
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

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* Today's Listing Section */}
        <ThemedText type="title" style={styles.title}>
          {"Today's Listing"}
        </ThemedText>

        {todayListings.length === 0 ? (
          <ThemedView style={styles.emptySection}>
            <ThemedText style={styles.emptyText}>No listing created today</ThemedText>
          </ThemedView>
        ) : (
          todayListings.map((listing) => (
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
                    productName={item.product_name}
                    quantity={pendingChanges[item.listing_line_item_id] ?? item.quantity.toString()}
                    onChange={(val) => handleQuantityChange(item.listing_line_item_id, val)}
                    editable={!saving}
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
               {hasChanges && (
                <TouchableOpacity
                  style={[styles.saveAllButton, saving && styles.saveAllButtonDisabled]}
                  onPress={handleSaveAll}
                  disabled={saving}
                >
                  <ThemedText style={styles.saveAllButtonText}>
                    {saving ? 'Saving...' : 'Save All Changes'}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {/* Listing History Section */}
        {pastListings.length > 0 && (
          <>
            <ThemedText type="title" style={styles.historyTitle}>
              Listing History
            </ThemedText>

            {pastListings.map((listing) => {
              const isExpanded = expandedListings.includes(listing.listing_id);
              return (
                <TouchableOpacity
                  key={listing.listing_id}
                  style={styles.historyItem}
                  onPress={() => toggleExpanded(listing.listing_id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.historyHeader}>
                    <View>
                      <ThemedText style={styles.listingDate}>
                        {listing.created_at
                          ? new Date(listing.created_at).toLocaleDateString()
                          : 'Past Listing'}
                      </ThemedText>
                      <ThemedText style={styles.itemCount}>
                        {listing.items.length} item{listing.items.length !== 1 ? 's' : ''}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.expandIcon}>
                      {isExpanded ? '▲' : '▼'}
                    </ThemedText>
                  </View>

                  {isExpanded && (
                    <View style={styles.historyItems}>
                      {listing.items.map((item) => (
                        <View key={item.listing_line_item_id} style={styles.historyLineItem}>
                          <ThemedText style={styles.historyItemName}>
                            {item.product_name}
                          </ThemedText>
                          <ThemedText style={styles.historyItemQty}>
                            {item.quantity}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
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
  emptySection: {
    marginHorizontal: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
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
  // History styles
  historyTitle: {
    padding: 16,
    paddingBottom: 8,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  historyItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expandIcon: {
    fontSize: 14,
    color: '#666',
  },
  historyItems: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  historyLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemName: {
    fontSize: 14,
    color: '#333',
  },
  historyItemQty: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  saveAllButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  saveAllButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});