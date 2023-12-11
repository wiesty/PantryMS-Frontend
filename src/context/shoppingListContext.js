// context/shoppingListContext.js
import React, { createContext, useState, useEffect } from 'react';
import shoppingListService from '../services/shoppingListService';

export const shoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await shoppingListService.getAllShoppingListItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching shopping list items', error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await shoppingListService.addShoppingListItem(itemData);
      setItems([...items, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding shopping list item', error);
      throw error;
    }
  };

  const editItem = async (itemId, itemData) => {
    try {
      const updatedItem = await shoppingListService.editShoppingListItem(itemId, itemData);
      setItems(items.map((item) => (item.item_id === itemId ? updatedItem : item)));
      return updatedItem;
    } catch (error) {
      console.error('Error editing shopping list item', error);
      throw error;
    }
  };

  return (
    <shoppingListContext.Provider value={{ items, setItems, addItem, editItem }}>
      {children}
    </shoppingListContext.Provider>
  );
};
