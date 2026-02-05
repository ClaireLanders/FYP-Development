// Component for editing a listing line item
// Shows product name with editable quantity input
// Displays save button only when quantity is changed
// Validates input and communicates updates to parent component
// Used within ListingEditor for managing individual line items
// This is adapted for React Native from my own code in frontend/src/components/ManageListings.jsx

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { ListingLineItem } from '../../services/types';

interface EditableLineItemProps {
  item: ListingLineItem;
  listingId: string;
  onUpdate: (listingId: string, itemId: string, quantity: number) => Promise<void>;
}

export const EditableLineItem: React.FC<EditableLineItemProps> = ({ item, listingId, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (text: string) => {
    setQuantity(text);
    setEditing(true);
  };

  const handleSave = async () => {
    const num = parseInt(quantity, 10);
    if (isNaN(num) || num < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    try {
      setSaving(true);
      await onUpdate(listingId, item.listing_line_item_id, num);
      setEditing(false);
      Alert.alert('Success', 'Quantity updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.productName}>{item.product_name}</ThemedText>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleChange}
          editable={!saving}
        />

        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? '...' : '✓'}
            </ThemedText>
          </TouchableOpacity>
        )}
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
    gap: 8,
  },
  input: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  saveButton: {
    width: 40,
    height: 40,
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
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