// TODO: ADD DESCRIPTION AND SOURCES
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { usePickupQR } from '@/hooks/usePickupQR';
import { ClaimStatusBadge } from './ClaimStatusBadge';

interface QRCodeDisplayProps {
  claimId: string;
  userId: string;
  onBack?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  claimId,
  userId,
  onBack,
}) => {
  const { qrData, loading, error, refresh } = usePickupQR(claimId, userId);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {error.includes('not approved') && (
          <Text style={styles.errorHint}>
            Your claim is waiting for store approval
          </Text>
        )}
        {onBack && (
          <TouchableOpacity style={styles.button} onPress={onBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!qrData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorMessage}>No QR code found</Text>
      </View>
    );
  }

  const totalItems = qrData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pickup QR Code</Text>
        <ClaimStatusBadge approved={true} complete={qrData.complete} />
      </View>

      {qrData.complete && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedText}>
            ✓ This order has been picked up
          </Text>
        </View>
      )}

      {!qrData.complete && (
        <Text style={styles.instruction}>
          Show this QR code to the store worker when you arrive to pick up your items
        </Text>
      )}

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <Image
          source={{ uri: qrData.qr_code_image }}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.qrCodeText}>{qrData.qr_code}</Text>
      </View>

      {/* Pickup Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Pickup Location</Text>
        <View style={styles.card}>
          <Text style={styles.storeName}>{qrData.store_info.org_name}</Text>
          <Text style={styles.branchName}>{qrData.store_info.branch_name}</Text>
          <Text style={styles.location}>{qrData.store_info.branch_location}</Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📦 Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Text>
        <View style={styles.card}>
          {qrData.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemRow,
                index < qrData.items.length - 1 && styles.itemRowBorder
              ]}
            >
              <Text style={styles.itemName}>{item.product_name}</Text>
              <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Instructions */}
      {!qrData.complete && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Instructions</Text>
          <View style={styles.card}>
            <Text style={styles.instructionStep}>
              1. Go to the pickup location listed above
            </Text>
            <Text style={styles.instructionStep}>
              2. Find a store worker
            </Text>
            <Text style={styles.instructionStep}>
              3. Show them this QR code
            </Text>
            <Text style={styles.instructionStep}>
              4. They will scan it and give you your items
            </Text>
          </View>
        </View>
      )}

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Claims</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  completedBanner: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  completedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrImage: {
    width: 280,
    height: 280,
  },
  qrCodeText: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 16,
    color: '#555',
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
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  instructionStep: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 18,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginTop: 10,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});