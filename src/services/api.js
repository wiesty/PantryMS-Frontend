// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_PantryMS_Backend,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
