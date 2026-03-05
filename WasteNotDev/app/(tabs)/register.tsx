// Organisation Registration screen (US11 & US12)
// Accessible from login page for new organisations
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OrgRegistrationForm } from '@/components/Registration/OrgRegistrationForm';

export default function RegisterScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back to Login</Text>
      </TouchableOpacity>
      <OrgRegistrationForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: 16, paddingBottom: 0 },
  backText: { color: '#4CAF50', fontSize: 14, fontWeight: '600' },
});