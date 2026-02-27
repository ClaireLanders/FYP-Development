// Displays a single user card with email, type, and optional branch assignment.
// Used in UserView to show both org-level and branch-level users.
// Shows an "Assign" button for unassigned users and a "Remove" button for branch users.
// React Native StyleSheet: (React Native, 2026)
// React Native TouchableOpacity: (React Native, 2025)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MemberCardProps {
  userEmail: string;
  userType: string;
  branchName?: string;
  onAssign?: () => void;
  onRemove?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  userEmail,
  userType,
  branchName,
  onAssign,
  onRemove,
}) => {
  const typeLabel = userType === 'C' ? 'Volunteer' : 'Staff';

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.email}>{userEmail}</Text>
        <View style={styles.detailsRow}>
          <View style={[styles.typeBadge, userType === 'C' ? styles.charityBadge : styles.storeBadge]}>
            <Text style={styles.typeBadgeText}>{typeLabel}</Text>
          </View>
          {branchName && (
            <Text style={styles.branchText}>{branchName}</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onAssign && (
          <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  charityBadge: {
    backgroundColor: '#E3F2FD',
  },
  storeBadge: {
    backgroundColor: '#FFF3E0',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  branchText: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  assignButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});