// Main form for creating a new listing
// Fetches available products for the branch from the backend
// Allows store workers to input quantities for each product
// Submits the listing to the backend via listingService
// Validates that at least one item has a quantity before submission
// This is adapted for React Native from my own code in frontend/src/components/Listing.jsx

import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ProductQuantityInput } from './ProductQuantityInput';
import { useProducts } from '../../hooks/useProducts';
import { listingService } from '../../services/listingService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export const ListingForm = () => {
  const { user } = useAuth();
  const BRANCH_ID = user?.branch_id ?? '';
  const USER_BRANCH_ID = user?.user_branch_id ?? '';
  const { products, loading, refetch } = useProducts(BRANCH_ID);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [hasListingToday, setHasListingToday] = useState(false);
  const [checking, setChecking] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    const checkAndRefetch = async () => {
      try {
        setChecking(true);
        void refetch();
        const listings = await listingService.getByBranch(BRANCH_ID);
        const today = new Date().toISOString().split('T')[0];
        const todayListing = listings.some(
          (l) => l.created_at && l.created_at.substring(0, 10) === today
        );
        setHasListingToday(todayListing);
      } catch (err) {
        console.error('Error checking today listing:', err);
      } finally {
        setChecking(false);
      }
    };
    void checkAndRefetch();
  }, [])
);


  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleSave = async () => {
    // Filter out items with quantity > 0
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        product_id: productId,
        quantity,
      }));

    if (items.length === 0) {
      Alert.alert('No Items', 'Please add at least one item to the listing.');
      return;
    }

    try {
      setSaving(true);
      await listingService.create({
        user_branch_id: USER_BRANCH_ID,
        items,
      });

      Alert.alert('Success', 'Listing created successfully!');

      // Reset quantities
      setQuantities({});
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create listing. Please try again.';
      Alert.alert('Error', errorMessage);
      console.error('Error creating listing:', error);
    } finally {
      setSaving(false);
    }
  };
  if (hasListingToday) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create Tonights Listing
      </ThemedText>
      <View style={styles.todayMessageContainer}>
        <ThemedText style={styles.todayMessageText}>
          You already have a listing for today.
        </ThemedText>
        <ThemedText style={styles.todayMessageSubtext}>
          You can edit quantities or add items on the Manage Listings tab.
        </ThemedText>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => router.push('/manage')}
        >
          <ThemedText style={styles.manageButtonText}>Go to Manage Listings</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

  if (loading || checking ) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create Tonights Listing
      </ThemedText>

      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <ProductQuantityInput
            key={product.product_id}
            product={product}
            quantity={quantities[product.product_id] || 0}
            onQuantityChange={(qty) => handleQuantityChange(product.product_id, qty)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <ThemedText style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save Listing'}
        </ThemedText>
      </TouchableOpacity>
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
  productList: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  todayMessageContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
},
todayMessageText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginBottom: 8,
},
todayMessageSubtext: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  marginBottom: 24,
},
manageButton: {
  backgroundColor: '#4CAF50',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  paddingHorizontal: 32,
},
manageButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
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