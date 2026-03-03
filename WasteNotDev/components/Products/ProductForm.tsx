// Form component for creating or editing a product (US13).
// Collects product name, description, price, category, and an optional image.
// Uses expo-image-picker to let the user select a photo from their device.
// When editing, pre-fills the form with the existing product data.
// Expo ImagePicker: (Expo, 2026)
// React Native StyleSheet: (React Native, 2026)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@/services/api';

interface ProductFormProps {
  // If editing, pass existing values; if creating, leave undefined
  initialName?: string;
  initialDesc?: string;
  initialPrice?: number;
  initialCategory?: string;
  initialImage?: string | null;
  onSubmit: (
    name: string,
    desc: string | null,
    price: number | null,
    category: string | null,
    imageUri: string | null,
  ) => Promise<boolean>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialName = '',
  initialDesc = '',
  initialPrice,
  initialCategory = '',
  initialImage = null,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDesc);
  const [price, setPrice] = useState(initialPrice ? initialPrice.toString() : '');
  const [category, setCategory] = useState(initialCategory);
  const [imageUri, setImageUri] = useState<string | null>(initialImage);
  const [saving, setSaving] = useState(false);
  const [newImagePicked, setNewImagePicked] = useState(false);

  // Opening the device image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setNewImagePicked(true);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const parsedPrice = price.trim() ? parseFloat(price) : null;
    if (parsedPrice !== null && isNaN(parsedPrice)) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setSaving(true);
      const success = await onSubmit(
        name.trim(),
        desc.trim() || null,
        parsedPrice,
        category.trim() || null,
        newImagePicked ? (imageUri ?? 'REMOVE'): null,
      );

      if (success && !isEditing) {
        // Clear form on successful creation
        setName('');
        setDesc('');
        setPrice('');
        setCategory('');
        setImageUri(null);
        onCancel();
      } else if (success && isEditing) {
        onCancel();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Text>

        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri && (imageUri.startsWith('/uploads/') || imageUri.startsWith('file://') || imageUri.startsWith('content://')) ? (
              <View>
                <Image source={{ uri: imageUri.startsWith('/uploads') ? `${API_BASE_URL}${imageUri}` : imageUri }}
                       style={styles.imagePreview} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Tap to change image</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setImageUri(null);
                    setNewImagePicked(true);
                  }}
                >
                    <Text style={styles.removeImageText}>Remove Image</Text>
                  </TouchableOpacity>
              </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Sourdough Bread"
          placeholderTextColor="#999"
          editable={!saving}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Bakery, Dairy, Produce"
          placeholderTextColor="#999"
          editable={!saving}
        />

        <Text style={styles.label}>Price (€)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 4.50"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          editable={!saving}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={desc}
          onChangeText={setDesc}
          placeholder="Brief description of the product"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
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
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  imagePicker: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 15,
    color: '#999',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 16,
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
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    alignItems: 'center',
},
imageOverlayText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
},

removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
},
removeImageText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
});
