// Product-related API calls
// Provides service functions to fetch and perform CRUD operations on products
// Communicates with backend product endpoints
// Uses FormData for create and update to support image file uploads (Expo, 2026)

import { api } from './api';
import type { Product, ProductOutput } from './types';

export const productService = {
  // Getting all products available for a specific branch (used by listing form)
  getByBranch: async (branchId: string): Promise<Product[]> => {
    const response = await api.get('/get_products',
        {params: {branch_id: branchId},
        });
    return response.data;
  },
// Creating a new product with optional image
  createProduct: async (
    branchId: string,
    productName: string,
    productDesc: string | null,
    productPrice: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<ProductOutput> => {
    const formData = new FormData();
    formData.append('branch_id', branchId);
    formData.append('product_name', productName);

    if (productDesc) formData.append('product_desc', productDesc);
    if (productPrice !== null) formData.append('product_price', productPrice.toString());
    if (category) formData.append('category', category);

    if (imageUri){
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('product_image', {
        uri: imageUri,
        name: filename,
        type: fileType,
      } as any);
    }

    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Updating an existing product with optional new image
  updateProduct: async (
    productId: string,
    productName: string | null,
    productDesc: string | null,
    productPrice: number | null,
    category: string | null,
    imageUri: string | null,
  ): Promise<ProductOutput> => {
    const formData = new FormData();

    if (productName) formData.append('product_name', productName);
    if (productDesc) formData.append('product_desc', productDesc);
    if (productPrice !== null) formData.append('product_price', productPrice.toString());
    if (category) formData.append('category', category);

    if (imageUri === 'REMOVE') {
      formData.append('remove_image', 'true');
    }else if (imageUri && (imageUri.startsWith('file://') || imageUri.startsWith('content://'))){
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('product_image', {
        uri: imageUri,
        name: filename,
        type: fileType,
      } as any);
    }
    console.log('FormData entries:', JSON.stringify(formData));
    console.log('Sending PATCH to:', `/products/${productId}`);
    const response = await api.patch(`/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Deleting a product
  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/products/${productId}`);
  },
};

