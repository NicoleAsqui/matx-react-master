import { createContext, useEffect, useReducer } from "react";
import alertsService from "../services/alertsService";

const NotificationContext = createContext({
  notifications: [],
  deleteNotification: async () => {},
  clearNotifications: async () => {},
  getNotifications: async () => {},
  createNotification: async () => {},
});

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_NOTIFICATIONS":
      return { ...state, notifications: action.payload || [] };

    case "DELETE_NOTIFICATION":
      return { ...state, notifications: action.payload || [] };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: action.payload || [] };

    case "CREATE_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };

    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { notifications: [] });

  const getNotifications = async () => {
    try {
      const data = await alertsService.getAll();
      dispatch({ type: "LOAD_NOTIFICATIONS", payload: data });
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const data = await alertsService.delete(id);
      dispatch({ type: "DELETE_NOTIFICATION", payload: data });
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      const data = await alertsService.markAllAsRead();
      dispatch({ type: "CLEAR_NOTIFICATIONS", payload: data });
    } catch (error) {
      console.error("Error clearing alerts:", error);
    }
  };

  const createNotification = async (notification) => {
    try {
      const data = await alertsService.create(notification);
      dispatch({ type: "CREATE_NOTIFICATION", payload: data });
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        getNotifications,
        deleteNotification,
        clearNotifications,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
