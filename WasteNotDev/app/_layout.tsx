// Root navigation layout
// Wraps tab navigator with a drawer for less-frequent admin screens
// Drawer items navigate to hidden tab routes so the bottom tabs remain visible (US14)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth, AuthProvider } from '@/context/AuthContext';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function AppDrawerContent(props: any) {
  const router = useRouter();
  const { user } = useAuth();

  const isStore = user?.user_type === 's';
  const isManager = user?.role === 'manager';

  // Admin/setup screens in drawer (store managers only)
  const showAdmin = isStore && isManager;

  return (
    <DrawerContentScrollView {...props}>
      {/* Daily workflow lives in tabs - keep this first */}
      <DrawerItem
        label="Home"
        onPress={() => {
          props.navigation.closeDrawer();
          router.replace('/(tabs)');
        }}
      />

      {/* Admin/setup items */}
      {showAdmin && (
        <>
          <DrawerItem
            label="Analytics"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push('/(tabs)/analytics');
            }}
          />
          <DrawerItem
            label="Products"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push('/(tabs)/products');
            }}
          />
          <DrawerItem
            label="Users"
            onPress={() => {
              props.navigation.closeDrawer();
              router.push('/(tabs)/users');
            }}
          />
        </>
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