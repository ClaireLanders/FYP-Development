// Custom hook for managing products (US13).
// Fetches products for the branch and provides functions to create, update, and delete.
// Re-fetches the product list after any changes to keep the UI in sync.
// React useState: (React Native, 2025)
// React useEffect: (React Native, 2025)
// React useCallback: (React Native, 2025)

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { productService } from '@/services/productService';
import type { ProductOutput } from '@/services/types';

export const useProductManagement = (branchId: string) => {
  const [products, setProducts] = useState<ProductOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching all products for the branch
  const loadProducts = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getByBranch(branchId);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // Creating a new product
  const createProduct = useCallback(async (
    productName: string,
    productDesc: string | null,
    productPrice: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<boolean> => {
    try {
      await productService.createProduct(
        branchId, productName, productDesc, productPrice, category, imageUri
      );
      await loadProducts();
      Alert.alert('Success', 'Product created successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create product';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [branchId, loadProducts]);

  // Updating an existing product
  const updateProduct = useCallback(async (
    productId: string,
    productName: string | null,
    productDesc: string | null,
    productPrice: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<boolean> => {
    try {
      await productService.updateProduct(
        productId, productName, productDesc, productPrice, category, imageUri
      );
      await loadProducts();
      Alert.alert('Success', 'Product updated successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update product';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadProducts]);

  // Deleting a product
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      await productService.deleteProduct(productId);
      await loadProducts();
      Alert.alert('Success', 'Product deleted successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete product';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};