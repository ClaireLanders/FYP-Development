// Tab navigation layout for the main app screens
// Shows login screen if user is not authenticated
// Conditionally shows tabs based on user_type and role (US14)
// Daily workflow stays in tabs, admin/setup navigates via drawer into hidden tab routes

import React from 'react';
import { Tabs } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { NoBranchScreen } from '@/components/Auth/NoBranchScreen';

import { AppHeader } from '@/components/Navigation/AppHeader';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Showing a loading spinner while checking for stored auth
  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  // If not logged in, show the login screen
  if (!user) {
    return <LoginScreen />;
  }

  // If logged in user not assigned to a branch yet
  if (!user.branch_id && user.role !== 'manager') {
    return <NoBranchScreen onLogout={handleLogout} />;
  }

  const isStore = user.user_type === 's';
  const isCharity = user.user_type === 'c';

  return (
    <>
      {/* Persistent header across all tabs (profile + hamburger + logout) */}
      <AppHeader />

      <Tabs
        initialRouteName={isCharity ? 'browse' : 'index'}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false, // AppHeader replaces screen headers
        }}
      >
        {/* Store tabs (daily workflow) */}
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
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />
            ),
            href: isStore ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="qr-scanner"
          options={{
            title: 'QR Scanner',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />
            ),
            href: isStore ? undefined : null,
          }}
        />

        {/* Charity tabs (daily workflow) */}
        <Tabs.Screen
          name="browse"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />
            ),
            href: isCharity ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="pickups"
          options={{
            title: 'Pickups',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />
            ),
            href: isCharity ? undefined : null,
          }}
        />

        {/* Admin/setup screens (hidden in tabs, opened from drawer) */}
        <Tabs.Screen name="analytics" options={{ title: 'Analytics', href: null }} />
        <Tabs.Screen name="products" options={{ title: 'Products', href: null }} />
        <Tabs.Screen name="users" options={{ title: 'Users', href: null }} />

        {/* Hidden routes (programmatic navigation only) */}
         <Tabs.Screen name="profile" options={{ title: 'Profile', href: null }} />
        <Tabs.Screen name="pickup-qr" options={{ title: 'QR Code', href: null }} />
        <Tabs.Screen name="claim-review" options={{ title: 'Review Claim', href: null }} />
        <Tabs.Screen name="register" options={{ title: 'Register', href: null }} />
      </Tabs>
    </>
  );
}