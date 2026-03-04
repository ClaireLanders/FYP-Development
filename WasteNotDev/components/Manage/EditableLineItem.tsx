// Component for editing a listing line item
// Shows product name with editable quantity input
// Quantity is controlled by parent component via onChange callback
// Includes increment/decrement buttons for easy quantity adjustment
// Used within ListingEditor for managing individual line items
// This is adapted for React Native from my own code in frontend/src/components/ManageListings.jsx

import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface EditableLineItemProps {
  productName: string;
  quantity: string;
  onChange: (text: string) => void;
  editable?: boolean;
}

export const EditableLineItem: React.FC<EditableLineItemProps> = ({ productName, quantity, onChange, editable = true }) => {
  const handleIncrement = () => {
    const num = parseInt(quantity, 10);
    if (!isNaN(num)) {
      onChange((num + 1).toString());
    }
  };

  const handleDecrement = () => {
    const num = parseInt(quantity, 10);
    if (!isNaN(num) && num > 0) {
      onChange((num - 1).toString());
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.productName}>{productName}</ThemedText>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.stepButton, !editable && styles.stepButtonDisabled]}
          onPress={handleDecrement}
          disabled={!editable}
        >
          <ThemedText style={styles.stepButtonText}>−</ThemedText>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={onChange}
          editable={editable}
        />

        <TouchableOpacity
          style={[styles.stepButton, !editable && styles.stepButtonDisabled]}
          onPress={handleIncrement}
          disabled={!editable}
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
  input: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
});