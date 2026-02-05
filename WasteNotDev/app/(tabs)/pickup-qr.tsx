// TODO: ADD DESCRIPTION AND SOURCES

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QRCodeDisplay } from '@/components/Pickup/QRCodeDisplay';

export default function PickupQRScreen() {
  const { claimId, userId } = useLocalSearchParams<{
    claimId: string;
    userId: string;
  }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <QRCodeDisplay
        claimId={claimId || ''}
        userId={userId || ''}
        onBack={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});