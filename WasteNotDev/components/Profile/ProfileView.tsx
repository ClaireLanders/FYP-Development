// Profile screen view (US12).
// Staff: read-only. Managers: can edit org + branch profile fields.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const ProfileView: React.FC = () => {
  const { user } = useAuth();

  const orgId = user?.org_id ?? '';
  const branchId = user?.branch_id ?? '';
  const userId = user?.user_id ?? '';
  const isManager = user?.role === 'manager';

  const { org, branch, loading, saving, error, refresh, updateOrganisation, updateBranch } =
    useProfile({ orgId, branchId, userId });

  const [editingOrg, setEditingOrg] = useState(false);
  const [editingBranch, setEditingBranch] = useState(false);

  const [orgNameDraft, setOrgNameDraft] = useState('');
  const [orgEmailDraft, setOrgEmailDraft] = useState('');
  const [branchNameDraft, setBranchNameDraft] = useState('');
  const [branchLocationDraft, setBranchLocationDraft] = useState('');

  // Keeping draft values in sync when data loads
  useMemo(() => {
    setOrgNameDraft(org?.org_name ?? user?.org_name ?? '');
    setOrgEmailDraft(org?.org_email ?? '');
    setBranchNameDraft(branch?.branch_name ?? user?.branch_name ?? '');
    setBranchLocationDraft(branch?.branch_location ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org?.org_name, org?.org_email, branch?.branch_name, branch?.branch_location]);

  const handleSaveOrg = async () => {
    try {
      await updateOrganisation({
        org_name: orgNameDraft,
        org_email: orgEmailDraft,
      });
      setEditingOrg(false);
      Alert.alert('Saved', 'Organisation details updated.');
    } catch (e) {
      Alert.alert('Error', 'Could not update organisation details.');
    }
  };

  const handleSaveBranch = async () => {
    try {
      await updateBranch({
        branch_name: branchNameDraft,
        branch_location: branchLocationDraft,
      });
      setEditingBranch(false);
      Alert.alert('Saved', 'Branch details updated.');
    } catch (e) {
      Alert.alert('Error', 'Could not update branch details.');
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Not logged in</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.helperText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title}>Profile</Text>

      {/* User details (always read-only) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.user_email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Organisation</Text>
          <Text style={styles.value}>{user.org_name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Branch</Text>
          <Text style={styles.value}>{user.branch_name ?? 'Not assigned'}</Text>
        </View>
      </View>

      {/* Organisation profile (US12) */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Organisation profile</Text>

          {isManager && (
            <TouchableOpacity
              onPress={() => setEditingOrg((v) => !v)}
              style={styles.editBtn}
              disabled={saving}
            >
              <Text style={styles.editText}>{editingOrg ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Org name</Text>
          {editingOrg ? (
            <TextInput
              style={styles.input}
              value={orgNameDraft}
              onChangeText={setOrgNameDraft}
              placeholder="Organisation name"
            />
          ) : (
            <Text style={styles.value}>{org?.org_name ?? user.org_name}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Org email</Text>
          {editingOrg ? (
            <TextInput
              style={styles.input}
              value={orgEmailDraft}
              onChangeText={setOrgEmailDraft}
              placeholder="Organisation email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{org?.org_email ?? 'Not set'}</Text>
          )}
        </View>

        {editingOrg && (
          <TouchableOpacity
            onPress={handleSaveOrg}
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save organisation'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Branch profile (US12) */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Branch profile</Text>

          {isManager && (
            <TouchableOpacity
              onPress={() => setEditingBranch((v) => !v)}
              style={styles.editBtn}
              disabled={saving}
            >
              <Text style={styles.editText}>{editingBranch ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Branch name</Text>
          {editingBranch ? (
            <TextInput
              style={styles.input}
              value={branchNameDraft}
              onChangeText={setBranchNameDraft}
              placeholder="Branch name"
            />
          ) : (
            <Text style={styles.value}>{branch?.branch_name ?? user.branch_name ?? 'Not set'}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          {editingBranch ? (
            <TextInput
              style={styles.input}
              value={branchLocationDraft}
              onChangeText={setBranchLocationDraft}
              placeholder="Branch location"
            />
          ) : (
            <Text style={styles.value}>{branch?.branch_location ?? 'Not set'}</Text>
          )}
        </View>

        {editingBranch && (
          <TouchableOpacity
            onPress={handleSaveBranch}
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save branch'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },

  row: { marginBottom: 10 },
  label: { fontSize: 12, color: '#777', marginBottom: 4 },
  value: { fontSize: 14, color: '#333' },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },

  editBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  editText: { fontSize: 13, fontWeight: '700', color: '#2196F3' },

  saveBtn: {
    marginTop: 6,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#cfcfcf' },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  errorBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3b7b7',
    marginBottom: 12,
  },
  errorText: { color: '#d32f2f', fontSize: 13 },
  helperText: { marginTop: 8, color: '#666' },
  retryBtn: { marginTop: 8, alignSelf: 'flex-start' },
  retryText: { color: '#2196F3', fontWeight: '700' },
});