import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface NoBranchScreenProps {
  onLogout: () => void;
}

export const NoBranchScreen = ({ onLogout }: NoBranchScreenProps) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>No Branch Assigned</ThemedText>
      <ThemedText style={styles.message}>
        You haven't been assigned to a branch yet. Please contact your manager.
      </ThemedText>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#dc3545',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});