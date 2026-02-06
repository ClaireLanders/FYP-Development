// Scanner Tab - QR Code Verification for Pickups
// Minimal code - just displays the scanner component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QRCodeScanner } from '../../components/Pickup/QRCodeScanner';

// TODO: Replace with actual user_branch_id from auth context
const USER_BRANCH_ID = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8'; // Tesco Express

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <QRCodeScanner userBranchId={'0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});