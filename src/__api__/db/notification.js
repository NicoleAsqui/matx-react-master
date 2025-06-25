import Mock from "../mock";
import { nanoid } from "nanoid";

const NotificationDB = {
  list: [
    /*{
      id: nanoid(),
      heading: "Message",
      icon: { name: "chat", color: "primary" },
      timestamp: 1570702802573,
      title: " from Devid",
      subtitle: "Hello, Any progress...",
      path: "chat"
    },*/
    {
      id: nanoid(),
      heading: "Alert",
      icon: { name: "notifications", color: "error" },
      timestamp: 1570702702573,
      title: "Producto casi agotado",
      subtitle: "El producto A está a 10% de su capacidad normal",
      path: "page-layouts/user-profile"
    },
    {
      id: nanoid(),
      heading: "Alert",
      icon: { name: "notifications", color: "error" },
      timestamp: 1570702702573,
      title: "Fecha de caducidad límite",
      subtitle: "El lote A caduca el 12 de junio del 2025 en el punto de venta B",
      path: "page-layouts/user-profile"
    }
  ]
};

Mock.onGet("/api/notification").reply(() => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/add").reply(() => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/delete").reply((config) => {
  let { id } = JSON.parse(config.data);
  console.log(config.data);

  const response = NotificationDB.list.filter((notification) => notification.id !== id);
  NotificationDB.list = [...response];
  return [200, response];
});

Mock.onPost("/api/notification/delete-all").reply(() => {
  NotificationDB.list = [];
  const response = NotificationDB.list;
  return [200, response];
});
