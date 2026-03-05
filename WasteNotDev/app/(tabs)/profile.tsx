// Tab screen entry point for the profile feature.
// Displays logged-in user + organisation + branch details (US12).

import { StyleSheet } from 'react-native';
import React from 'react';
import { ProfileView } from '@/components/Profile/ProfileView';

export default function ProfileScreen() {
  return <ProfileView />;
}

const styles = StyleSheet.create({});