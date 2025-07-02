import Mock from "../mock";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "app/config";

let mockInventory = [
  {
    id: "C-2001",
    nombre: "Cerveza Artesanal El Conde - 330ml",
    categoria: "Bebidas",
    marca: "El Conde",
    precioCompra: 1.5,
    precioVenta: 2.5,
    stockTotal: 10,
    stockMinimo: 20,
    caducidad: "2025-08-10",
    lote: "CE-20250601",
    puntoVenta: "Gasolinera Guayaquil",
  },
  {
    id: "C-2002",
    nombre: "Cerveza Artesanal El Conde - 500ml",
    categoria: "Bebidas",
    marca: "El Conde",
    precioCompra: 2.2,
    precioVenta: 3.5,
    stockTotal: 60,
    stockMinimo: 10,
    caducidad: "2025-09-15",
    lote: "CE-20250602",
    puntoVenta: "Gasolinera Durán",
  },
];

// Normalizamos la URL base sin slash final
const baseUrl = API_BASE_URL.replace(/\/$/, "") + "/inventario";

// GET all
Mock.onGet(baseUrl).reply(200, mockInventory);

// GET by ID
Mock.onGet(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const item = mockInventory.find(p => p.id === id);
  return item ? [200, item] : [404, { message: "Producto no encontrado" }];
});

// POST create
Mock.onPost(baseUrl).reply(config => {
  const newItem = JSON.parse(config.data);
  newItem.id = nanoid();
  mockInventory.push(newItem);
  return [201, newItem];
});

// PUT update
Mock.onPut(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockInventory.findIndex(p => p.id === id);
  if (index === -1) return [404, { message: "No encontrado" }];
  const updatedItem = { ...mockInventory[index], ...JSON.parse(config.data) };
  mockInventory[index] = updatedItem;
  return [200, updatedItem];
});

// DELETE
Mock.onDelete(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockInventory.findIndex(p => p.id === id);
  if (index === -1) return [404, { message: "No encontrado" }];
  mockInventory.splice(index, 1);
  return [204];
});
