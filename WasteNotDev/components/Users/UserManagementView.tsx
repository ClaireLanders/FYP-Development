// Main view for user management (US9 & US10).
// Displays two sections: Branch Users (assigned) and Organisation Users (all).
// Provides ability to add new users, assign unassigned users to the branch,
// and remove users from the branch.
// React Native ScrollView, RefreshControl: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)
// React Navigation useFocusEffect: (React Navigation, 2025)

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserCard } from './UserCard';
import { UserRegisterForm } from './UserRegisterForm';
import { useAuth } from '@/context/AuthContext';


export function UserManagementView() {
  const {user} = useAuth();
  const ORG_ID = user?.org_id ?? '';
  const BRANCH_ID = user?.branch_id ?? '';
  const USER_TYPE = user?.user_type?? 's';
  const{
    orgUsers,
    branchUsers,
    loading,
    error,
    refresh,
    createUser,
    assignToBranch,
    removeFromBranch,
  } = useUserManagement(ORG_ID, BRANCH_ID);

  const [showForm, setShowForm] = useState(false);

  // Re-fetch when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [])
  );

  // Work out which org users are NOT assigned to this branch
  const branchUserIds = branchUsers.map((bu) => bu.user_id);
  const unassignedUsers = orgUsers.filter(
    (ou) => !branchUserIds.includes(ou.user_id)
  );

  const handleAssign = (userId: string) => {
    Alert.alert(
      'Assign User',
      'Assign this user to the current branch?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () =>
            assignToBranch({
              user_id: userId,
              org_id: ORG_ID,
              branch_id: BRANCH_ID,
            }),
        },
      ]
    );
  };

  const handleRemove = (userBranchId: string) => {
    Alert.alert(
      'Remove User',
      'Remove this user from the branch? They will remain in the organisation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromBranch(userBranchId),
        },
      ]
    );
  };

  if (loading && orgUsers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSubtitle}>Manage staff for your branch</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSubtitle}>Manage staff for your branch</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>Manage staff for your branch</Text>
      </View>

      {/* Add User Button / Form */}
      <View style={styles.section}>
        {showForm ? (
          <UserRegisterForm
            orgId={ORG_ID}
            userType={USER_TYPE}
            onSubmit={createUser}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addButtonText}>+ Add New User</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Branch Users Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Branch Users</Text>
        {branchUsers.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No users assigned</Text>
            <Text style={styles.emptySubtext}>
              Assign users from the organisation pool below
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {branchUsers.map((user) => (
              <UserCard
                key={user.user_branch_id}
                userEmail={user.user_email}
                userType={user.user_type}
                branchName={user.branch_name}
                onRemove={() => handleRemove(user.user_branch_id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Unassigned Org Users Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unassigned Users</Text>
        {unassignedUsers.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No unassigned users</Text>
            <Text style={styles.emptySubtext}>
              All organisation users are assigned to a branch
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {unassignedUsers.map((user) => (
              <UserCard
                key={user.user_id}
                userEmail={user.user_email}
                userType={user.user_type}
                onAssign={() => handleAssign(user.user_id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  listContainer: {},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  emptySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});