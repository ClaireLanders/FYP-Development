// Browse screen - View and claim available listings
// This screen renders the ListingBrowser component which displays all available food listings
// that charity volunteers can browse and claim
// This is the main screen for charity users to find food


import { StyleSheet } from 'react-native';
import { ListingBrowser } from '@/components/Browse/ListingBrowser';

export default function BrowseScreen() {
  return <ListingBrowser />;
}

const styles = StyleSheet.create({
});

