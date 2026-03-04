// Tab navigation layout for the main app screens
// Shows login screen if user is not authenticated
// Conditionally shows tabs based on user_type and role (US14)
// This is adapted from Expo Router's tab layout pattern (Expo, 2024)

import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { NoBranchScreen } from '@/components/Auth/NoBranchScreen';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Showing a loading spinner while checking for stored auth
  if (loading) {
    return (
        <ActivityIndicator size="large" color="#4CAF50" />
    );
  }

  // If not logged in, show the login screen
  if (!user) {
    return <LoginScreen />;
  }

  // If logged in user nto assigned to a branch yet
  if (!user.branch_id && user.role !== 'manager') {
    return <NoBranchScreen onLogout={handleLogout} />;
  }

  // Determining which tabs to show based on user_type and role
  const isStore = user.user_type === 's';
  const isCharity = user.user_type === 'c';
  const isManager = user.role === 'manager';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
          headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Text style={{ color: '#f44336', fontSize: 14, fontWeight: '600'}as const }>Log Out</Text>
          </TouchableOpacity>
        ),
      }}>

      {/* Store tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          href: isStore ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: isStore ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          title: 'Approvals',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          href: isStore ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="qr-scanner"
        options={{
          title: 'QR Scanner',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          href: isStore ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: isStore && isManager ? undefined : null,
        }}
      />

      {/* Charity tabs */}
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          href: isCharity ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="pickups"
        options={{
          title: 'Pickups',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          href: isCharity ? undefined : null,
        }}
      />

      {/* Shared tabs - managers only */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: isStore && isManager ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: isManager ? undefined : null,
        }}
      />

      {/* Register tab - hidden when logged in */}
      <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: null,
        }}
      />

      {/* Pickup QR - charity only */}
      <Tabs.Screen
        name="pickup-qr"
        options={{
          title: 'QR Code',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          href: isCharity ? undefined : null,
        }}
      />
    </Tabs>
  );
}

