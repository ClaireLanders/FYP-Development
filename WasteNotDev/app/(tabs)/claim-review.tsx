// Review claim screen
// Shows the selected store and items before claim submission
// Allows charity volunteers to confirm and submit their claim

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { claimService } from '@/services/claimService';

interface ReviewItem {
  listing_line_item_id: string;
  product_name: string;
  quantity: number;
}

export default function ClaimReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const userBranchId = (params.userBranchId as string) ?? '';
  const orgName = (params.orgName as string) ?? '';
  const branchName = (params.branchName as string) ?? '';
  const branchLocation = (params.branchLocation as string) ?? '';
  const selectedItemsParam = (params.selectedItems as string) ?? '[]';

  const selectedItems: ReviewItem[] = useMemo(() => {
    try {
      return JSON.parse(selectedItemsParam);
    } catch {
      return [];
    }
  }, [selectedItemsParam]);

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitClaim = async () => {
    if (!userBranchId || selectedItems.length === 0) {
      Alert.alert('Error', 'Missing claim details.');
      return;
    }

    try {
      setSubmitting(true);

      await claimService.create({
        user_branch_id: userBranchId,
        items: selectedItems.map((item) => ({
          listing_line_item_id: item.listing_line_item_id,
          quantity: item.quantity,
        })),
      });

      Alert.alert(
        'Claim Submitted',
        'Your claim has been submitted and is awaiting store approval.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/pickups'),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting claim:', error);
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.title}>
          Review Claim
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Pickup From</ThemedText>
          <ThemedText style={styles.orgName}>{orgName}</ThemedText>
          <ThemedText style={styles.branchName}>{branchName}</ThemedText>
          {!!branchLocation && (
            <ThemedText style={styles.location}>{branchLocation}</ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>
            Selected Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </ThemedText>

          {selectedItems.map((item, index) => (
            <View
              key={item.listing_line_item_id}
              style={[
                styles.itemRow,
                index < selectedItems.length - 1 && styles.itemRowBorder,
              ]}
            >
              <ThemedText style={styles.itemName}>{item.product_name}</ThemedText>
              <ThemedText style={styles.itemQty}>×{item.quantity}</ThemedText>
            </View>
          ))}
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>What happens next?</ThemedText>
          <ThemedText style={styles.infoText}>
            1. Your claim will be sent to the store
          </ThemedText>
          <ThemedText style={styles.infoText}>
            2. The store will review and approve or reject it
          </ThemedText>
          <ThemedText style={styles.infoText}>
            3. If approved, it will appear in your Pickups tab
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmitClaim}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.submitButtonText}>Submit Claim</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  orgName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#777',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemQty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});