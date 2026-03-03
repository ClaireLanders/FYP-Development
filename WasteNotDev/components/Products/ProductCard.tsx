// Displays a single product card with name, category, price, description, and image.
// Shows edit and delete action buttons.
// Used in the ProductManagementView to display each product in the list.
// React Native Image: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '@/services/api';

interface ProductCardProps {
  productId: string;
  productName: string;
  productDesc: string | null;
  productImage: string | null;
  productPrice: number | null;
  category: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productName,
  productDesc,
  productImage,
  productPrice,
  category,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {productImage && productImage.startsWith('/uploads/') && (
        <Image
          source={{ uri: `${API_BASE_URL}${productImage}` }}
          style={styles.image}
          resizeMode="cover"
          />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{productName}</Text>

        <View style={styles.detailsRow}>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          {productPrice !== null && (
            <Text style={styles.price}>€{productPrice.toFixed(2)}</Text>
          )}
        </View>

        {productDesc && (
          <Text style={styles.description} numberOfLines={2}>
            {productDesc}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: 'red'
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  deleteButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
  },
});