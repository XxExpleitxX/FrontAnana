import axios from "axios";
import type { DetalleVenta } from "../entities/DetalleVenta";
import BaseService from "./BaseService";

// entities/DetalleVentaDTO.ts
export interface DetalleVentaDTO {
    cantidad: number;
    precioAplicado: number | null;
    productoId: number;
    ventaId: number;
}

export default class DetalleVentaService extends BaseService<DetalleVenta> {

    async findAllByVentaId(path: string, ventaId: number): Promise<DetalleVenta[]> {
        const response = await axios.get<DetalleVenta[]>(`${path}/venta/${ventaId}`);
        return response.data;
    }

    // Nuevo método para enviar un DTO
    async postDTO(path: string, dto: DetalleVentaDTO): Promise<DetalleVenta> {
        const response = await axios.post<DetalleVenta>(path, dto);
        return response.data;
    }

}