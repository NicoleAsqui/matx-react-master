import Mock from "../mock";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "app/config";

let mockMovements = [
  {
    id: "M-1001",
    fecha: "2023-05-15",
    producto: "Vino Tinto Reserva",
    tipo: "egreso",
    categoria: "degustacion",
    cantidad: 5,
    costo_unitario: 8.50,
    costo_total: 42.50,
    punto_venta: "Tienda Centro",
    responsable: "Juan Pérez",
    cliente: "Cliente VIP 001",
    motivo: "Degustación para cliente preferencial",
    aprobado_por: "María González"
  },
  {
    id: "M-1002",
    fecha: "2023-05-16",
    producto: "Whisky 12 años",
    tipo: "egreso",
    categoria: "promocion",
    cantidad: 2,
    costo_unitario: 25.00,
    costo_total: 50.00,
    punto_venta: "Tienda Norte",
    responsable: "Ana López",
    cliente: "N/A",
    motivo: "Promoción de lanzamiento",
    aprobado_por: "Carlos Ruiz"
  },
  {
    id: "M-1003",
    fecha: "2023-05-17",
    producto: "Cerveza Artesanal",
    tipo: "egreso",
    categoria: "merma",
    cantidad: 12,
    costo_unitario: 1.80,
    costo_total: 21.60,
    punto_venta: "Tienda Sur",
    responsable: "Luis Martínez",
    cliente: "N/A",
    motivo: "Caducidad",
    aprobado_por: "Sistema"
  },
  {
    id: "M-1004",
    fecha: "2023-05-18",
    producto: "Ron Añejo",
    tipo: "egreso",
    categoria: "devolucion",
    cantidad: 1,
    costo_unitario: 30.00,
    costo_total: 30.00,
    punto_venta: "Tienda Centro",
    responsable: "Pedro Sánchez",
    cliente: "Cliente Regular 045",
    motivo: "Producto defectuoso",
    aprobado_por: "María González"
  },
  {
    id: "M-1005",
    fecha: "2023-05-19",
    producto: "Vino Blanco",
    tipo: "ingreso",
    categoria: "compra",
    cantidad: 50,
    costo_unitario: 6.00,
    costo_total: 300.00,
    punto_venta: "Tienda Centro",
    responsable: "Sistema",
    cliente: "N/A",
    motivo: "Reabastecimiento",
    aprobado_por: "N/A"
  }
];

// Normalizamos la URL base sin slash final
const baseUrl = API_BASE_URL.replace(/\/$/, "") + "/movimientos";

// GET all movements
Mock.onGet(baseUrl).reply(200, mockMovements);

// GET movement by ID
Mock.onGet(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const movement = mockMovements.find(m => m.id === id);
  return movement ? [200, movement] : [404, { message: "Movimiento no encontrado" }];
});

// POST create movement
Mock.onPost(baseUrl).reply(config => {
  const newMovement = JSON.parse(config.data);
  newMovement.id = `M-${nanoid(4)}`;
  newMovement.costo_total = newMovement.cantidad * newMovement.costo_unitario;
  mockMovements.push(newMovement);
  return [201, newMovement];
});

// PUT update movement
Mock.onPut(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockMovements.findIndex(m => m.id === id);
  if (index === -1) return [404, { message: "Movimiento no encontrado" }];
  const updatedData = JSON.parse(config.data);
  const updatedMovement = { 
    ...mockMovements[index], 
    ...updatedData,
    costo_total: updatedData.cantidad * updatedData.costo_unitario
  };
  mockMovements[index] = updatedMovement;
  return [200, updatedMovement];
});

// DELETE movement
Mock.onDelete(new RegExp(`${baseUrl}/.+`)).reply(config => {
  const id = config.url.split("/").pop();
  const index = mockMovements.findIndex(m => m.id === id);
  if (index === -1) return [404, { message: "Movimiento no encontrado" }];
  mockMovements.splice(index, 1);
  return [204];
});

// GET movements by type (ingreso/egreso)
Mock.onGet(new RegExp(`${baseUrl}/filter\\?tipo=.+`)).reply(config => {
  const type = new URL(config.url).searchParams.get("tipo");
  const filtered = mockMovements.filter(m => m.tipo === type);
  return [200, filtered];
});

// GET movements by category
Mock.onGet(new RegExp(`${baseUrl}/filter\\?categoria=.+`)).reply(config => {
  const category = new URL(config.url).searchParams.get("categoria");
  const filtered = mockMovements.filter(m => m.categoria === category);
  return [200, filtered];
});

export default mockMovements;
