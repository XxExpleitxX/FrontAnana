import axios from "axios";
import Venta from "../entities/Venta";
import BaseService from "./BaseService";

export default class VentaService extends BaseService<Venta> {

    async getVentasPorUsuario(path: string, userId: number): Promise<Venta[]> {
        try {
            const response = await axios.get<Venta[]>(`${path}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener ventas del usuario:", error);
            return [];
        }
    }

    async eliminarVentasEntreFechas(path: string, desde: string, hasta: string): Promise<boolean> {
        try {
            const response = await axios.delete(`${path}/eliminar-entre-fechas`, {
                params: { desde, hasta }
            });
            console.log("✅ Ventas eliminadas:", response.data);
            return true;
        } catch (error) {
            console.error("Error al eliminar ventas:", error);
            return false;
        }
    }

}