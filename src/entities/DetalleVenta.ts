import type DetallePromocion from "./DetallePromocion";
import Producto from "./Producto";
import type Promocion from "./Promocion";
import Venta from "./Venta";

export interface DetalleVenta {
    id: number | null;
    cantidad: number;
    producto: Producto;
    venta: Venta | null;
    precioAplicado?: number | null;
    esPromocion: boolean;
    promocionId: number | null;
    productosPromocion: DetallePromocion[];
    promocionCompleta?: Promocion;
}