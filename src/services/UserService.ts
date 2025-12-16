import axios from "axios";
import User from "../entities/User";
import BaseService from "./BaseService";

export default class UserService extends BaseService<User> {

    async post(url: string, user: User): Promise<User> {
        try {
            const response = await axios.post(url, user, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                throw new Error("El nombre de usuario ya existe");
            }
            throw error;
        }
    }
}