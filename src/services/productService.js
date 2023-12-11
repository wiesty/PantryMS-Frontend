// services/productService.js
import api from './api';

const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  editProduct: async (productId, productData) => {
    console.log('Editing product with ID:', productId);
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productService;
