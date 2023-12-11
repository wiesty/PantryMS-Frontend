// context/productContext.js
import React, { createContext, useState, useEffect } from 'react';
import productService from '../services/productService';

export const productContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.addProduct(productData);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product', error);
      throw error;
    }
  };

  const editProduct = async (productId, productData) => {
    try {
      const updatedProduct = await productService.editProduct(productId, productData);
      setProducts(products.map((product) => (product.id === productId ? updatedProduct : product)));
      return updatedProduct;
    } catch (error) {
      console.error('Error editing product', error);
      throw error;
    }
  };

  return (
    <productContext.Provider value={{ products, setProducts, addProduct, editProduct }}>
      {children}
    </productContext.Provider>
  );
};
