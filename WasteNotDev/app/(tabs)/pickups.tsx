// TODO - DESCRIPTION AND SOURCES

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MyPickupsList } from '@/components/Pickup/PickupsList';

export default function Pickups() {
  return (
    <View style={styles.container}>
      <MyPickupsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});