import axios from 'axios';

const API_URL = 'https://tu-api.com/movimientos';

const movementsService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching movements:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movement ${id}:`, error);
      throw error;
    }
  },

  create: async (movementData) => {
    try {
      const response = await axios.post(API_URL, movementData);
      return response.data;
    } catch (error) {
      console.error('Error creating movement:', error);
      throw error;
    }
  },

  update: async (id, movementData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, movementData);
      return response.data;
    } catch (error) {
      console.error(`Error updating movement ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting movement ${id}:`, error);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/filter?tipo=${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error filtering movements by type ${type}:`, error);
      throw error;
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/filter?categoria=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error filtering movements by category ${category}:`, error);
      throw error;
    }
  }
};

export default movementsService;