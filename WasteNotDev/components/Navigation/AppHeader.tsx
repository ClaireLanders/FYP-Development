// Persistent app header shown across tabs
// Displays menu button, logged-in user details, and logout action
// Keeps navigation simple while moving admin/setup screens into the drawer

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

export const AppHeader = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleLogout = async () => {
    await logout();
  };

  const displayName = (() => {
    // Using email prefix as a simple display name until a dedicated name field is added
    const email = user?.user_email ?? '';
    if (email.includes('@')) return email.split('@')[0];
    return email || 'User';
  })();

  const organisationName =
    user?.org_name || (user?.user_type === 's' ? 'Store' : 'Charity');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.orgName}>{organisationName}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  menuText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orgName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
});