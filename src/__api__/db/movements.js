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
    costoUnitario: 8.50,
    costoTotal: 42.50,
    puntoVenta: "Tienda Centro",
    responsable: "Juan Pérez",
    cliente: "Cliente VIP 001",
    motivo: "Degustación para cliente preferencial",
    aprobadoPor: "María González"
  },
  {
    id: "M-1002",
    fecha: "2023-05-16",
    producto: "Whisky 12 años",
    tipo: "egreso",
    categoria: "promocion",
    cantidad: 2,
    costoUnitario: 25.00,
    costoTotal: 50.00,
    puntoVenta: "Tienda Norte",
    responsable: "Ana López",
    cliente: "N/A",
    motivo: "Promoción de lanzamiento",
    aprobadoPor: "Carlos Ruiz"
  },
  {
    id: "M-1003",
    fecha: "2023-05-17",
    producto: "Cerveza Artesanal",
    tipo: "egreso",
    categoria: "merma",
    cantidad: 12,
    costoUnitario: 1.80,
    costoTotal: 21.60,
    puntoVenta: "Tienda Sur",
    responsable: "Luis Martínez",
    cliente: "N/A",
    motivo: "Caducidad",
    aprobadoPor: "Sistema"
  },
  {
    id: "M-1004",
    fecha: "2023-05-18",
    producto: "Ron Añejo",
    tipo: "egreso",
    categoria: "devolucion",
    cantidad: 1,
    costoUnitario: 30.00,
    costoTotal: 30.00,
    puntoVenta: "Tienda Centro",
    responsable: "Pedro Sánchez",
    cliente: "Cliente Regular 045",
    motivo: "Producto defectuoso",
    aprobadoPor: "María González"
  },
  {
    id: "M-1005",
    fecha: "2023-05-19",
    producto: "Vino Blanco",
    tipo: "ingreso",
    categoria: "compra",
    cantidad: 50,
    costoUnitario: 6.00,
    costoTotal: 300.00,
    puntoVenta: "Tienda Centro",
    responsable: "Sistema",
    cliente: "N/A",
    motivo: "Reabastecimiento",
    aprobadoPor: "N/A"
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
  newMovement.costoTotal = newMovement.cantidad * newMovement.costoUnitario;
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
    costoTotal: updatedData.cantidad * updatedData.costoUnitario
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
