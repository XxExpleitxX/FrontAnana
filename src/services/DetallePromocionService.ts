import axios from "axios";
import DetallePromocion from "../entities/DetallePromocion";
import BaseService from "./BaseService";

export default class DetallePromocionService extends BaseService<DetallePromocion> {

    async findAllByPromocionId(path: string, promocionId: number): Promise<DetallePromocion[]> {
        const response = await axios.get<DetallePromocion[]>(`${path}/promocion/${promocionId}`);
        return response.data;
    }

}