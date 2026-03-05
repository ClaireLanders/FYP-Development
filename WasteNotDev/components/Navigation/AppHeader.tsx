// Persistent app header shown across all tabs
// Shows hamburger menu for managers

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export const AppHeader: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const isManager = user?.role === 'manager';
  const router = useRouter();

  return (
  <View style={styles.container}>
    {isManager ? (
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.left}>
        <Text style={styles.hamburger}>☰</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.left} />
    )}
    <View style={styles.right}>
      <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
        <Text style={styles.profileText}>Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    paddingTop:
      Platform.OS === 'ios'
        ? 56
        : (StatusBar.currentHeight ?? 0) + 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
  },
  hamburger: {
    fontSize: 22,
    color: '#333',
  },
  right: { flex: 1,
    alignItems: 'flex-end' },

profileText: { color: '#2196F3', fontSize: 13, fontWeight: '700' },
});