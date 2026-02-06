// QR Code Verification for Pickups
import {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { QRCodeScanner } from '../../components/Pickup/QRCodeScanner';
import { VerificationResult} from '../../components/Pickup/VerificationResult';
import {VerifyPickupResponse} from '../../services/pickupService';


const USER_BRANCH_ID = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8'; // Tesco Express

export default function ScannerScreen() {
  const [verificationResult, setVerificationResult] = useState<VerifyPickupResponse | null>(null);

  const handleVerified = (result: VerifyPickupResponse) => {
    setVerificationResult(result);
  };

  const handleDone = () => {
    setVerificationResult(null);
  };

  if (verificationResult){
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
});