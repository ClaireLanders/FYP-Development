
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { pickupService, VerifyPickupResponse } from '@/services/pickupService';


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
  // Fix for expo-camera multiple callback firing issue
  // useRef provides synchronous updates (NashTech, 2024)
  // setting to false intitially, then to true to prevent duplicate api calls
  const processingRef = React.useRef(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);


    useEffect(() => {
    // Resetting the processing flag when the component unmounts
    // Cleanup function to ensure the ref is reset for the next mount
    return () => {
      processingRef.current = false;
    };
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Check to prevent rapid-fire scanning
    if (scanned || verifying || processingRef.current){
      return;
    }
    // Setting the ref immediately to block subsequent scans
    processingRef.current = true; // Synchronous block, checking it first as it updates immediately
    setScanned(true); // Asynchronous state update
    setVerifying(true); // Asynchronous state update

    try {
      const result = await pickupService.verifyPickup(data, userBranchId);

      onVerified(result);

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to verify pickup';

      // Resetting the processing flag on error so user can try again
      processingRef.current = false;

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
// (ReactNative, 2026)
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
