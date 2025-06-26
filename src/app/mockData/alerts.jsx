
import { nanoid } from "nanoid";
// Datos de ejemplo para alertas
export const alertData = [
  {
    id: nanoid(),
    tipo: "caducidad",
    severidad: "alta",
    timestamp: new Date(2025, 5, 5).getTime(),
    titulo: "Fecha de caducidad límite",
    descripcion: "El lote VT-2024-001 (Vino Tinto Reserva) caduca el 12 de junio del 2025",
    detalles: {
      producto: "Vino Tinto Reserva",
      lote: "VT-2024-001",
      fecha_caducidad: "2025-06-12",
      punto_venta: "Metrópolis",
      stock_actual: 15,
      cliente_asignado: "Cliente Premium 001"
    },
    leida: false
  },
  {
    id: nanoid(),
    tipo: "stock",
    severidad: "media",
    timestamp: new Date(2025, 5, 4).getTime(),
    titulo: "Producto casi agotado",
    descripcion: "El producto Whisky 12 años está a 10% de su stock normal",
    detalles: {
      producto: "Whisky 12 años",
      stock_actual: 5,
      stock_minimo: 50,
      punto_venta: "Metrópolis",
      proveedor: "Distribuidor Licores SA"
    },
    leida: false
  },
  {
    id: nanoid(),
    tipo: "caducidad",
    severidad: "alta",
    timestamp: new Date(2025, 5, 5).getTime(),
    titulo: "Fecha de caducidad límite",
    descripcion: "El lote VT-2024-001 (Vino Tinto Reserva) caduca el 12 de junio del 2025",
    detalles: {
      producto: "Vino Tinto Reserva",
      lote: "VT-2024-001",
      fecha_caducidad: "2025-06-12",
      punto_venta: "Metrópolis",
      stock_actual: 15,
      cliente_asignado: "Cliente Premium 001"
    },
    leida: false
  },
  {
    id: nanoid(),
    tipo: "stock",
    severidad: "media",
    timestamp: new Date(2025, 5, 4).getTime(),
    titulo: "Producto casi agotado",
    descripcion: "El producto Whisky 12 años está a 10% de su stock normal",
    detalles: {
      producto: "Whisky 12 años",
      stock_actual: 5,
      stock_minimo: 50,
      punto_venta: "Metrópolis",
      proveedor: "Distribuidor Licores SA"
    },
    leida: false
  },
];
