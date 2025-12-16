import axios from "axios";
import Promocion from "../entities/Promocion";
import BaseService from "./BaseService";

export default class PromocionService extends BaseService<Promocion> {

    async agregarPromocionAVenta(apiUrl: string, ventaId: number, promocionId: number): Promise<any> {
        try {
            const response = await axios.put(`${apiUrl}/venta/agregar-promocion/${ventaId}/${promocionId}`);
            return response.data; // axios ya convierte JSON automáticamente
        } catch (error: any) {
            console.error("Error al agregar la promoción a la venta:", error);
            throw new Error("Error al agregar la promoción a la venta");
        }
    }

}