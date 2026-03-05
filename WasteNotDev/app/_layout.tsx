// Root navigation layout
// Wraps tab navigator with a drawer for less-frequent admin screens
// Drawer items navigate to hidden tab routes so the bottom tabs remain visible (US14)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth, AuthProvider } from '@/context/AuthContext';

function AppDrawerContent(props: any) {
  const router = useRouter();
  const { user } = useAuth();

  const isStore = user?.user_type === 's';
  const isCharity = user?.user_type === 'c';
  const isManager = user?.role === 'manager';

  const showAnalytics = isStore && isManager;
  const showProducts = isStore && isManager;
  const showUsers = isManager;

  const homeRoute = isCharity ? '/(tabs)/browse' : '/(tabs)';

  return (
    <DrawerContentScrollView {...props}>
      {/* Daily workflow lives in tabs - keep this first */}
      <DrawerItem
        label="Home"
        onPress={() => {
          props.navigation.closeDrawer();
          router.replace(homeRoute);
        }}
      />

      {/* Admin/setup items */}
      {showAnalytics && (
        <DrawerItem
          label="Analytics"
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(tabs)/analytics');
          }}
        />
      )}

      {showProducts && (
        <DrawerItem
          label="Products"
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(tabs)/products');
          }}
        />
      )}

      {showUsers && (
        <DrawerItem
          label="Users"
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(tabs)/users');
          }}
        />
      )}
    </DrawerContentScrollView>
  );
}

function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />

      <Drawer
        screenOptions={{
          headerShown: false, // AppHeader is rendered inside the tabs layout
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        {/* Tabs = main app workflow */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Tabs',
          }}
        />
      </Drawer>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // Keeping AuthProvider exactly as-is
  return (
    <AuthProvider>
      <DrawerLayout />
    </AuthProvider>
  );
}