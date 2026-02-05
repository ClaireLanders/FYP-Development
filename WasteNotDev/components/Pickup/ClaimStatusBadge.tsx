// TODO: ADD DESCRIPTION AND SOURCES
// TODO: GET RID OF UNNESSESARY COMMENTS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClaimStatusBadgeProps {
  approved: boolean;
  complete: boolean;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({
  approved,
  complete
}) => {
  if (complete) {
    return (
      <View style={[styles.badge, styles.completeBadge]}>
        <Text style={styles.badgeText}>PICKED UP</Text>
      </View>
    );
  }

  if (approved) {
    return (
      <View style={[styles.badge, styles.approvedBadge]}>
        <Text style={styles.badgeText}>APPROVED</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.pendingBadge]}>
      <Text style={styles.badgeText}>PENDING</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  pendingBadge: {
    backgroundColor: '#FFA726',
  },
  approvedBadge: {
    backgroundColor: '#4CAF50',
  },
  completeBadge: {
    backgroundColor: '#2196F3',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});