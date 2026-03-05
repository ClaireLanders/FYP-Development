// Component for displaying a single listing item that can be claimed
// Shows product name, available quantity, and +/- controls for claim quantity
// Validates that claimed quantity doesn't exceed available quantity
// Used within the ListingBrowser to display individual line items
// This is adapted for React Native from my own code in frontend/src/components/Browse.jsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { ListingLineItem } from '../../services/types';

interface ClaimableItemProps {
  item: ListingLineItem;
  claimQuantity: number;
  onClaimQuantityChange: (quantity: number) => void;
}

export const ClaimableItem: React.FC<ClaimableItemProps> = ({
  item,
  claimQuantity,
  onClaimQuantityChange,
}) => {
  const handleIncrement = () => {
    if (claimQuantity < item.quantity) {
      onClaimQuantityChange(claimQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (claimQuantity > 0) {
      onClaimQuantityChange(claimQuantity - 1);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.productName}>{item.product_name}</ThemedText>
        <ThemedText style={styles.available}>{item.quantity} available</ThemedText>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.stepButton, claimQuantity === 0 && styles.stepButtonDisabled]}
          onPress={handleDecrement}
          disabled={claimQuantity === 0}
        >
          <ThemedText style={styles.stepButtonText}>−</ThemedText>
        </TouchableOpacity>

        <View style={styles.quantityDisplay}>
          <ThemedText style={styles.quantityText}>{claimQuantity}</ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.stepButton, claimQuantity >= item.quantity && styles.stepButtonDisabled]}
          onPress={handleIncrement}
          disabled={claimQuantity >= item.quantity}
        >
          <ThemedText style={styles.stepButtonText}>+</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  available: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepButton: {
    width: 36,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  stepButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  quantityDisplay: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
});