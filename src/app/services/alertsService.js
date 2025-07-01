import axios from "axios";
import { API_BASE_URL } from "app/config";

const ALERTS_URL = `${API_BASE_URL}/api/alerts`;

const alertsService = {
  getAll: async () => {
    try {
      const response = await axios.get(ALERTS_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${ALERTS_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alert ${id}:`, error);
      throw error;
    }
  },

  create: async (alertData) => {
    try {
      const response = await axios.post(ALERTS_URL, alertData);
      return response.data;
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    }
  },

  update: async (id, alertData) => {
    try {
      const response = await axios.put(`${ALERTS_URL}/${id}`, alertData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alert ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${ALERTS_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting alert ${id}:`, error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axios.patch(`${ALERTS_URL}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking alert ${id} as read:`, error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await axios.patch(`${ALERTS_URL}/read-all`);
      return response.data;
    } catch (error) {
      console.error("Error marking all alerts as read:", error);
      throw error;
    }
  },

  getFilterOptions: async () => {
    try {
      const response = await axios.get(`${ALERTS_URL}/filter-options`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      const response = await axios.get(`${ALERTS_URL}?type=${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alerts by type ${type}:`, error);
      throw error;
    }
  },
};

export default alertsService;
