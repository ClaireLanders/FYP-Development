// TODO: ADD DESCRIPTION AND SOURCES

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { pickupService, VerifyPickupResponse } from '@/services/pickupService';

// TODO: add source
interface QRCodeScannerProps {
  userBranchId: string;
  onVerified: (result: VerifyPickupResponse) => void;
  onCancel: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  userBranchId,
  onVerified,
  onCancel
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || verifying) return;

    setScanned(true);
    setVerifying(true);

    try {
      const result = await pickupService.verifyPickup(data, userBranchId);

      onVerified(result);

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to verify pickup';

      Alert.alert(
        'Verification Failed',
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
              setVerifying(false);
            }
          },
          {
            text: 'Cancel',
            onPress: onCancel,
            style: 'cancel'
          }
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50"/>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {verifying && (
        <View style={styles.verifyingOverlay}>
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  verifyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
},
});
