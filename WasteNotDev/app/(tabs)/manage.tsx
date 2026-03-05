// Manage screen - Edit and cancel listings
// This screen renders the ListingEditor component which allows store workers
// to edit quantities or cancel their existing listings
// Store workers use this screen to manage their active donations

import { StyleSheet } from 'react-native';
import { ListingEditor } from '@/components/Manage/ListingEditor';

export default function ManageScreen() {
  return <ListingEditor />;
}

const styles = StyleSheet.create({
});
