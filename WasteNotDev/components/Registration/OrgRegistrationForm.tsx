// Registration form for setting up a new organisation (US11 & US12).
// Collects org details, first branch details, and manager account info.
// org_type determines whether the user is registering a store or charity.
// React Native TextInput: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useOrgRegistration } from '@/hooks/useOrgRegistration';
import {useRouter} from "expo-router";


export function OrgRegistrationForm() {
  const { loading, registerOrg } = useOrgRegistration();

  const [orgType, setOrgType] = useState<'s' | 'c'>('s');
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter()

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });
  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

const handleSubmit = async () => {
    if (!orgName.trim()) {
      alert('Please enter an organisation name');
      return;
    }
    if (!orgEmail.trim()) {
      alert('Please enter an organisation email');
      return;
    }
    if (!branchName.trim()) {
      alert('Please enter a branch name');
      return;
    }
    if (!branchLocation.trim()) {
      alert('Please enter a branch location');
      return;
    }
    if (!managerEmail.trim()) {
      alert('Please enter a manager email');
      return;
    }
    if (!managerPassword.trim()) {
      alert('Please enter a password');
      return;
    }
    if (managerPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const result = await registerOrg({
      org_type: orgType,
      org_name: orgName.trim(),
      org_email: orgEmail.trim(),
      branch_name: branchName.trim(),
      branch_location: branchLocation.trim(),
      manager_email: managerEmail.trim(),
      manager_password: managerPassword,
    }, imageUri);

    if (result) {
  setOrgName('');
  setOrgEmail('');
  setBranchName('');
  setBranchLocation('');
  setManagerEmail('');
  setManagerPassword('');
  setImageUri(null);
  router.replace('/(tabs)');
}
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Register Organisation</Text>
            <Text style={styles.headerSubtitle}>
              Set up your organisation, branch, and manager account
            </Text>
          </View>
          {/* Org Type Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organisation Type</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, orgType === 's' && styles.toggleButtonActive]}
                onPress={() => setOrgType('s')}
              >
                <Text style={[styles.toggleText, orgType === 's' && styles.toggleTextActive]}>
                  Store
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, orgType === 'c' && styles.toggleButtonActive]}
                onPress={() => setOrgType('c')}
              >
                <Text style={[styles.toggleText, orgType === 'c' && styles.toggleTextActive]}>
                  Charity
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Organisation Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organisation Details</Text>
            {/* Optional org logo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Organisation Logo (optional)</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker} disabled={loading}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                ) : (
                  <Text style={styles.imagePickerText}>Tap to add logo</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Organisation Name</Text>
            <TextInput
              style={styles.input}
              value={orgName}
              onChangeText={setOrgName}
              placeholder="e.g. Tesco"
              placeholderTextColor="#999"
              editable={!loading}
            />

            <Text style={styles.label}>Organisation Email</Text>
            <TextInput
              style={styles.input}
              value={orgEmail}
              onChangeText={setOrgEmail}
              placeholder="e.g. contact@tesco.ie"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Branch Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Branch Details</Text>

            <Text style={styles.label}>Branch Name</Text>
            <TextInput
              style={styles.input}
              value={branchName}
              onChangeText={setBranchName}
              placeholder="e.g. Tesco Express"
              placeholderTextColor="#999"
              editable={!loading}
            />

            <Text style={styles.label}>Branch Address</Text>
            <TextInput
              style={styles.input}
              value={branchLocation}
              onChangeText={setBranchLocation}
              placeholder="e.g. Brewery Quarter, South Main St, Cork"
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Manager Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manager Account</Text>

            <Text style={styles.label}>Manager Email</Text>
            <TextInput
              style={styles.input}
              value={managerEmail}
              onChangeText={setManagerEmail}
              placeholder="e.g. manager@tesco.ie"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={managerPassword}
              onChangeText={setManagerPassword}
              placeholder="Min 6 characters"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Register Organisation</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#81C784',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1
  },
  imagePicker: {
  height: 120,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#ddd',
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fafafa',
},
imagePreview: {
  width: '100%',
  height: '100%',
  borderRadius: 12,
},
imagePickerText: {
  color: '#999',
  fontSize: 14,
},
});