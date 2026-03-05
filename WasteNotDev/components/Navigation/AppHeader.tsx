// Persistent app header shown across all tabs
// Shows logged-in user + org, and provides hamburger + profile + logout (US14)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export const AppHeader: React.FC = () => {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const { user, logout } = useAuth();

  const name = user?.user_email ?? '';
  const org = user?.org_name ?? '';

  const isManager = user?.role === 'manager';

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      {/* Hide hamburger when user has no drawer items (non-managers) */}
      {isManager ? (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.left}>
          <Text style={styles.hamburger}>☰</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.left} />
      )}

      <View style={styles.center}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.orgText}>{org}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
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
  center: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburger: {
    fontSize: 22,
    color: '#333',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  orgText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  profileText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 13,
    fontWeight: '600',
  },
});