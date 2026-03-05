// Root layout for the entire application
// This file is adapted from the default Expo _layout.tsx (Expo, 2024)
// Wraps the whole app in AuthProvider (existing auth persistence)
// Keeps ThemeProvider and StatusBar in place
// Adds a Drawer around the (tabs) group so admin/setup screens can move out of the bottom tab bar (US14)
import 'react-native-gesture-handler';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function DrawerLayout() {
  const { user } = useAuth();

  const isStore = user?.user_type === 's';
  const isManager = user?.role === 'manager';

  return (
    <Drawer
      screenOptions={{
        // Tabs render the persistent AppHeader, so keep drawer header off
        headerShown: false,
      }}
    >
      {/* Main app tabs (daily workflow stays here) */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
        }}
      />

      {/* Admin/setup screens (manager-only, accessed from drawer) */}
      <Drawer.Screen
        name="(tabs)/analytics"
        options={{
          title: 'Analytics',
          drawerItemStyle: isManager ? undefined : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="(tabs)/products"
        options={{
          title: 'Products',
          drawerItemStyle: isStore && isManager ? undefined : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="(tabs)/users"
        options={{
          title: 'Users',
          drawerItemStyle: isManager ? undefined : { display: 'none' },
        }}
      />

      {/* Hidden routes - not in drawer */}
      <Drawer.Screen
        name="(tabs)/pickup-qr"
        options={{
          title: 'QR Code',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="(tabs)/claim-review"
        options={{
          title: 'Review Claim',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="(tabs)/register"
        options={{
          title: 'Register',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <DrawerLayout />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
