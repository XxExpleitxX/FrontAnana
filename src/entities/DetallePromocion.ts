import Producto from "./Producto";
import Promocion from "./Promocion";

export default class DetallePromocion {
    id: number | null = null;
    cantidad: number = 0;
    promocion: Promocion = new Promocion();
    producto: Producto = new Producto();
}