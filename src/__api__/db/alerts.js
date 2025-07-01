import Mock from "../mock";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "app/config";

const generateAlerts = () => {
  const stores = ["Metrópolis", "Centro", "Norte", "Sur"];
  const products = [
    "Vino Tinto Reserva", 
    "Whisky 12 años", 
    "Vodka Premium", 
    "Ron Añejo",
    "Cerveza Artesanal",
    "Ginebra Premium"
  ];
  
  return Array.from({ length: 20 }, (_, i) => {
    const type = Math.random() > 0.5 ? "caducidad" : "stock";
    const store = stores[Math.floor(Math.random() * stores.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);

    const daysUntilExpiry = Math.floor(Math.random() * 60) - 15;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

    const severity = type === "caducidad" 
      ? daysUntilExpiry <= 0 ? "alta" : daysUntilExpiry <= 7 ? "media" : "baja"
      : Math.random() > 0.7 ? "alta" : Math.random() > 0.4 ? "media" : "baja";

    return {
      id: `alert-${nanoid()}`,
      tipo: type,
      severidad: severity,
      titulo: type === "caducidad" 
        ? `Caducidad próxima - ${product}` 
        : `Stock bajo - ${product}`,
      descripcion: type === "caducidad"
        ? `El producto ${product} ${daysUntilExpiry <= 0 ? "está vencido" : `caduca en ${daysUntilExpiry} días`}`
        : `Stock bajo del producto ${product}`,
      timestamp: timestamp.toISOString(),
      leida: Math.random() > 0.7,
      detalles: {
        producto: product,
        punto_venta: store,
        ...(type === "caducidad" ? {
          lote: `LT-${Math.floor(1000 + Math.random() * 9000)}`,
          fecha_caducidad: expiryDate.toISOString(),
          dias_restantes: daysUntilExpiry,
          stock_actual: Math.floor(5 + Math.random() * 20),
          cliente_asignado: `Cliente ${Math.floor(1 + Math.random() * 100)}`
        } : {
          stock_actual: Math.floor(Math.random() * 10),
          stock_minimo: 15,
          deficit_stock: 15 - Math.floor(Math.random() * 10),
          proveedor: `Proveedor ${Math.floor(1 + Math.random() * 5)}`
        })
      }
    };
  });
};

let mockAlerts = generateAlerts();

// Usamos API_BASE_URL en todos los endpoints para centralizar
const baseUrl = API_BASE_URL.replace(/\/$/, ""); // elimina posible slash al final

Mock.onGet(`${baseUrl}`).reply(200, mockAlerts);

Mock.onGet(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const alert = mockAlerts.find(a => a.id === id);
  return alert ? [200, alert] : [404, { message: "Alerta no encontrada" }];
});

Mock.onPost(`${baseUrl}`).reply(config => {
  const newAlert = JSON.parse(config.data);
  newAlert.id = `alert-${nanoid()}`;
  mockAlerts.unshift(newAlert);
  return [201, newAlert];
});

Mock.onPut(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockAlerts.findIndex(a => a.id === id);
  if (index === -1) return [404, { message: "Alerta no encontrada" }];
  const updatedAlert = { ...mockAlerts[index], ...JSON.parse(config.data) };
  mockAlerts[index] = updatedAlert;
  return [200, updatedAlert];
});

Mock.onDelete(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockAlerts.findIndex(a => a.id === id);
  if (index === -1) return [404, { message: "Alerta no encontrada" }];
  mockAlerts.splice(index, 1);
  return [204];
});

Mock.onPatch(new RegExp(`${baseUrl}/.+/read`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockAlerts.findIndex(a => a.id === id);
  if (index === -1) return [404, { message: "Alerta no encontrada" }];
  mockAlerts[index].leida = true;
  return [200, mockAlerts[index]];
});

Mock.onPatch(`${baseUrl}/read-all`).reply(() => {
  mockAlerts = mockAlerts.map(alert => ({ ...alert, leida: true }));
  return [200, { success: true }];
});

Mock.onGet(`${baseUrl}/filter-options`).reply(200, {
  types: ["caducidad", "stock"],
  severities: ["alta", "media", "baja"],
  stores: ["Metrópolis", "Centro", "Norte", "Sur"],
  products: [
    "Vino Tinto Reserva", 
    "Whisky 12 años", 
    "Vodka Premium", 
    "Ron Añejo",
    "Cerveza Artesanal",
    "Ginebra Premium"
  ]
});

Mock.onGet(new RegExp(`${baseUrl}\\?type=.+`)).reply(config => {
  const url = new URL(config.url);
  const type = url.searchParams.get("type");
  const filtered = mockAlerts.filter(a => a.tipo === type);
  return [200, filtered];
});

export default mockAlerts;
