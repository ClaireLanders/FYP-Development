// Profile screen view.
// Staff: read-only details. Managers: can edit org + branch fields (US12).

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const ProfileView: React.FC = () => {
  const { user } = useAuth();

  const orgId = user?.org_id ?? '';
  const branchId = user?.branch_id ?? '';

  const isManager = user?.role === 'manager';

  const { org, branch, loading, error, updateOrganisation, updateBranch, savingOrg, savingBranch } =
    useProfile(orgId, branchId);

  // Display fallbacks from auth (so screen still works if backend fetch fails)
  const displayOrgName = org?.org_name ?? user?.org_name ?? '';
  const displayOrgEmail = org?.org_email ?? '';
  const displayBranchName = branch?.branch_name ?? user?.branch_name ?? '';
  const displayBranchLocation = branch?.branch_location ?? '';

  const [editingOrg, setEditingOrg] = useState(false);
  const [editingBranch, setEditingBranch] = useState(false);

  const [orgNameInput, setOrgNameInput] = useState('');
  const [orgEmailInput, setOrgEmailInput] = useState('');
  const [branchNameInput, setBranchNameInput] = useState('');
  const [branchLocationInput, setBranchLocationInput] = useState('');

  // Prefill inputs when entering edit mode
  useMemo(() => {
    if (editingOrg) {
      setOrgNameInput(displayOrgName);
      setOrgEmailInput(displayOrgEmail);
    }
    if (editingBranch) {
      setBranchNameInput(displayBranchName);
      setBranchLocationInput(displayBranchLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingOrg, editingBranch]);

  const handleSaveOrg = async () => {
    try {
      await updateOrganisation({
        org_name: orgNameInput.trim(),
        org_email: orgEmailInput.trim(),
      });
      setEditingOrg(false);
      Alert.alert('Saved', 'Organisation details updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update organisation.');
    }
  };

  const handleSaveBranch = async () => {
    try {
      await updateBranch({
        branch_name: branchNameInput.trim(),
        branch_location: branchLocationInput.trim(),
      });
      setEditingBranch(false);
      Alert.alert('Saved', 'Branch details updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update branch.');
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Not logged in</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.muted}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.title}>Profile</Text>

      {/* User details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Account</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.user_email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{user.user_type}</Text>
        </View>
      </View>

      {/* Organisation */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Organisation</Text>

          {isManager && !editingOrg && (
            <TouchableOpacity onPress={() => setEditingOrg(true)}>
              <Text style={styles.link}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {!editingOrg ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{displayOrgName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>
                {displayOrgEmail ? displayOrgEmail : 'Not set'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Organisation Name</Text>
            <TextInput
              value={orgNameInput}
              onChangeText={setOrgNameInput}
              style={styles.input}
              placeholder="Organisation name"
            />

            <Text style={styles.inputLabel}>Organisation Email</Text>
            <TextInput
              value={orgEmailInput}
              onChangeText={setOrgEmailInput}
              style={styles.input}
              placeholder="Organisation email"
              autoCapitalize="none"
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setEditingOrg(false)}
                disabled={savingOrg}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton, savingOrg && styles.disabled]}
                onPress={handleSaveOrg}
                disabled={savingOrg}
              >
                <Text style={styles.primaryButtonText}>
                  {savingOrg ? 'Saving…' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Branch */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Branch</Text>

          {isManager && !editingBranch && (
            <TouchableOpacity onPress={() => setEditingBranch(true)}>
              <Text style={styles.link}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {!editingBranch ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{displayBranchName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>
                {displayBranchLocation ? displayBranchLocation : 'Not set'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Branch Name</Text>
            <TextInput
              value={branchNameInput}
              onChangeText={setBranchNameInput}
              style={styles.input}
              placeholder="Branch name"
            />

            <Text style={styles.inputLabel}>Branch Location</Text>
            <TextInput
              value={branchLocationInput}
              onChangeText={setBranchLocationInput}
              style={styles.input}
              placeholder="Branch location"
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setEditingBranch(false)}
                disabled={savingBranch}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton, savingBranch && styles.disabled]}
                onPress={handleSaveBranch}
                disabled={savingBranch}
              >
                <Text style={styles.primaryButtonText}>
                  {savingBranch ? 'Saving…' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', color: '#333', marginBottom: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12 },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 13, color: '#666' },
  value: { fontSize: 13, color: '#333', fontWeight: '600', marginLeft: 10, flexShrink: 1, textAlign: 'right' },

  link: { color: '#2196F3', fontWeight: '800' },

  inputLabel: { fontSize: 12, color: '#666', marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },

  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginLeft: 8 },
  primaryButton: { backgroundColor: '#4CAF50' },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  secondaryButtonText: { color: '#333', fontWeight: '700' },
  disabled: { opacity: 0.7 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  muted: { marginTop: 10, color: '#777' },
  errorText: { color: '#f44336', marginBottom: 10, fontWeight: '700' },
});