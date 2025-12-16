import type { RolesUsuario } from "./enums/RolesUsuario";

export default class User {
    id: number | null = null;
    usuario: string = "";
    clave: string = "";
    mensaje?: string;
    rol: RolesUsuario = "USER"; // valor por defecto válido
}