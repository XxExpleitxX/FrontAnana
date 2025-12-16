import DetallePromocion from "./DetallePromocion";

export default class Promocion {
    id: number | null = null;
    denominacion: string = "";
    descripcion: string = "";
    fechaInicio: Date = new Date();
    fechaFin: Date = new Date();
    precioPromocional: number = 0;
    detallePromociones: DetallePromocion[] = [];
}