import axios from "axios";
import Persona from "../entities/Persona";
import BaseService from "./BaseService";

export default class PersonaService extends BaseService<Persona> {

    static async findByUserId(path: string, userId: number): Promise<Persona> {
        const response = await axios.get<Persona>(`${path}/user/${userId}`);
        return response.data;
    }

}