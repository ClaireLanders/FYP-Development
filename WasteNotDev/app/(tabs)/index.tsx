// This screen renders the ListingForm component which allows store workers
// to create new food donation listings by entering product quantities
// This is the default/home tab for store workers

import React, { useEffect } from 'react';
import { ListingForm } from '@/components/Listing/ListingForm';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.user_type === 'c') {
      router.replace('/(tabs)/browse');
    }
  }, [user, router]);

  if (user?.user_type === 'c') return null;

  return <ListingForm />;
}