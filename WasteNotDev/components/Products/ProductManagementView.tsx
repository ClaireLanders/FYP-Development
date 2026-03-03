// Main view for product management (US13).
// Displays a list of products for the branch with options to add, edit, and delete.
// Uses the ProductCard to display each product and ProductForm for create/edit.
// React Native ScrollView, RefreshControl: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProductManagement } from '@/hooks/useProductManagement';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import type { ProductOutput } from '@/services/types';

// TODO: Replace with actual user context/authentication
const BRANCH_ID = '03a897a0-e271-4174-aed2-d283a888dbae';

export function ProductManagementView() {
  const {
    products,
    loading,
    error,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductManagement(BRANCH_ID);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductOutput | null>(null);

  // Re-fetch when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [])
  );

  const handleCreate = async (
    name: string,
    desc: string | null,
    price: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<boolean> => {
    return await createProduct(name, desc, price, category, imageUri);
  };

  const handleUpdate = async (
    name: string,
    desc: string | null,
    price: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<boolean> => {
    if (!editingProduct) return false;
    return await updateProduct(
      editingProduct.product_id, name, desc, price, category, imageUri
    );
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
  };

  const handleEdit = (product: ProductOutput) => {
    setEditingProduct(product);
    setShowForm(false); // Close create form if open
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product Management</Text>
          <Text style={styles.headerSubtitle}>Manage products for your branch</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product Management</Text>
          <Text style={styles.headerSubtitle}>Manage products for your branch</Text>
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
        <Text style={styles.headerTitle}>Product Management</Text>
        <Text style={styles.headerSubtitle}>Manage products for your branch</Text>
      </View>

      {/* Add Product Button / Form */}
      <View style={styles.section}>
        {showForm ? (
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setShowForm(true);
              setEditingProduct(null);
            }}
          >
            <Text style={styles.addButtonText}>+ Add New Product</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Product List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Your Products ({products.length})
        </Text>

        {products.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No products yet</Text>
            <Text style={styles.emptySubtext}>
              Add products so they can be used in listings
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {products.map((product) => (
              <View key={product.product_id}>
                {editingProduct?.product_id === product.product_id ? (
                  <ProductForm
                    initialName={product.product_name}
                    initialDesc={product.product_desc || ''}
                    initialPrice={product.product_price || undefined}
                    initialCategory={product.category || ''}
                    initialImage={product.product_image}
                    onSubmit={handleUpdate}
                    onCancel={handleCancelEdit}
                    isEditing={true}
                  />
                ) : (
                  <ProductCard
                    productId={product.product_id}
                    productName={product.product_name}
                    productDesc={product.product_desc}
                    productImage={product.product_image}
                    productPrice={product.product_price}
                    category={product.category}
                    onEdit={() => handleEdit(product)}
                    onDelete={() => handleDelete(product.product_id)}
                  />
                )}
              </View>
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