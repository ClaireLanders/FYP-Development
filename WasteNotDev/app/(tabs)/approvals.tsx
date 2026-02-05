import React from 'react';
import { StyleSheet } from 'react-native';
import { PendingClaimsList } from '@/components/ClaimApproval/PendingClaimsList';

export default function Approvals() {
  return <PendingClaimsList />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});