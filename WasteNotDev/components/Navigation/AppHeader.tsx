// Persistent app header shown across all tabs
// Shows logged-in user + org, and provides hamburger + logout (US14)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const AppHeader: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const name = user?.user_email ?? ''; // your field name
  const org = user?.org_name ?? '';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.left}>
        <Text style={styles.hamburger}>☰</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.orgText}>{org}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.right}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
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
    width: 80,
    alignItems: 'flex-end',
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
  logoutText: {
    color: '#f44336',
    fontSize: 13,
    fontWeight: '600',
  },
});