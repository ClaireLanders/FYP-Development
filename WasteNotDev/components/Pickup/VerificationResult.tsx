
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { VerifyPickupResponse } from '@/services/pickupService';

interface VerificationResultProps {
  result: VerifyPickupResponse;
  onDone: () => void;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  result,
  onDone
}) => {
  const totalItems = result.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Icon */}
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      <Text style={styles.title}>Pickup Verified!</Text>

      {result.charity_name && (
        <View style={styles.charityBadge}>
          <Text style={styles.charityText}>{result.charity_name}</Text>
        </View>
      )}

      <Text style={styles.message}>{result.message}</Text>

      {/* Items */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>
          Items to Release ({totalItems})
        </Text>
        <View style={styles.itemsCard}>
          {result.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemRow,
                index < result.items.length - 1 && styles.itemRowBorder
              ]}
            >
              <Text style={styles.itemName}>{item.product_name}</Text>
              <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Next Steps:</Text>
        <Text style={styles.instruction}>
          1. Gather all the items listed above
        </Text>
        <Text style={styles.instruction}>
          2. Give them to {result.charity_name || 'the charity representative'}
        </Text>
        <Text style={styles.instruction}>
          3. The pickup is now complete!
        </Text>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  charityBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  charityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  itemsSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
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
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  instructionBox: {
    width: '100%',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 8,
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});