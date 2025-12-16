import type { DetalleVenta } from "./DetalleVenta";
import type { EstadoVenta } from "./enums/EstadoVenta";
import type { FormaPago } from "./enums/FormaPago";
import User from "./User";

export default class Venta {
    id: number | null = null;
    fecha: Date = new Date();
    formaPago: FormaPago = "EFECTIVO"; 
    total: number = 0;
    envio: number = 0; 
    estadoVenta: EstadoVenta = "PENDIENTE"; 
    detalleVentas?: DetalleVenta[]; 
    user: User | null = null;
    observaciones: string = "";
}