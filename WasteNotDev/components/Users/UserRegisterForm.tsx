// Form component for creating a new user within an organisation
// Collects email, password, and user type
// Validates inputs before submission
// org_id is passed in as a prop since it comes from the parent view
// React Native TextInput: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { CreateOrgUserRequest } from '@/services/types';

interface UserRegisterFormProps {
  orgId: string;
  userType: string; // 'C' for charity, 'S' for store
  onSubmit: (data: CreateOrgUserRequest) => Promise<boolean>;
  onCancel: () => void;
}

export const MemberForm: React.FC<UserRegisterFormProps> = ({
  orgId,
  userType,
  onSubmit,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const typeLabel = userType === 'C' ? 'Volunteer' : 'Staff Member';

  const handleSubmit = async () => {
    // Basic validation
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }
    if (!password.trim()) {
      alert('Please enter a password');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const success = await onSubmit({
        user_email: email.trim(),
        user_type: userType,
        org_id: orgId,
        password: password,
      });

      if (success) {
        // Clear the form on success
        setEmail('');
        setPassword('');
        onCancel(); // Close the form
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New {typeLabel}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="user@example.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!saving}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Min 6 characters"
        placeholderTextColor="#999"
        secureTextEntry
        editable={!saving}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create {typeLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#81C784',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});