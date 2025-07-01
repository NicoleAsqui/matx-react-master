import axios from "axios";
import { API_BASE_URL } from "../app/config";

const API_URL = `${API_BASE_URL}/api/inventory`;

const inventoryService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  create: async (productData) => {
    try {
      const response = await axios.post(API_URL, productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  getFilterOptions: async () => {
    try {
      const response = await axios.get(`${API_URL}/filter-options`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  },
};

export default inventoryService;
