// services/shoppingListService.js
import api from './api';

const shoppingListService = {
  getAllShoppingListItems: async () => {
    const response = await api.get('/shopping-list');
    return response.data;
  },

  addShoppingListItem: async (itemData) => {
    const response = await api.post('/shopping-list', itemData);
    return response.data;
  },

  editShoppingListItem: async (itemId, itemData) => {
    const response = await api.put(`/shopping-list/${itemId}`, itemData);
    return response.data;
  },

  deleteShoppingListItem: async (itemId) => {
    const response = await api.delete(`/shopping-list/${itemId}`);
    return response.data;
  },
};

export default shoppingListService;
