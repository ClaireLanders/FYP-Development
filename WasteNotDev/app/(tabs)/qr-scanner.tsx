// QR Code Verification for Pickups
import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { QRCodeScanner } from '../../components/Pickup/QRCodeScanner';
import { VerificationResult } from '../../components/Pickup/VerificationResult';
import { VerifyPickupResponse } from '../../services/pickupService';
import { useAuth } from '@/context/AuthContext';

export default function ScannerScreen() {
  const [verificationResult, setVerificationResult] = useState<VerifyPickupResponse | null>(null);
  const { user } = useAuth();

  const USER_BRANCH_ID = user?.user_branch_id ?? '';
  const BRANCH_NAME = user?.branch_name ?? '';
  const ORG_NAME = user?.org_name ?? '';

  const handleVerified = (result: VerifyPickupResponse) => {
    setVerificationResult(result);
  };

  const handleDone = () => {
    setVerificationResult(null);
  };

  if (!USER_BRANCH_ID) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>No branch assigned. Please contact your manager.</Text>
      </View>
    );
  }

  if (verificationResult) {
    return (
      <View style={styles.container}>
        <VerificationResult result={verificationResult} onDone={handleDone} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <QRCodeScanner
        userBranchId={USER_BRANCH_ID}
        onVerified={handleVerified}
        onCancel={handleDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

});